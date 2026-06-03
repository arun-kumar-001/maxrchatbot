import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AIFactory } from '../../core/ai/ai.factory';
import { AIMessage, AIResponse } from '../../core/ai/ai.interface';
import { PromptInjectionFilter } from '../../core/security/prompt-injection.filter';
import { SupabaseService } from '../../core/database/supabase.service';
import { KnowledgeService } from '../knowledge/knowledge.service';

const DEFAULT_SYSTEM_PROMPT =
  'You are MAXR Assistant, a friendly AI customer support agent. Be helpful, concise, and professional. Use the provided knowledge context when relevant. If you cannot answer from context, say so honestly and offer to connect the user with a human agent.';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private aiFactory: AIFactory,
    private promptFilter: PromptInjectionFilter,
    private supabase: SupabaseService,
    private knowledgeService: KnowledgeService,
  ) {}

  async createWidgetConversation(visitorId?: string) {
    const vid = visitorId || randomUUID();
    const { data, error } = await this.supabase.client
      .from('conversations')
      .insert({
        source: 'widget',
        status: 'active',
        metadata: { visitor_id: vid },
      })
      .select('id')
      .single();

    if (error || !data) {
      throw new Error(error?.message || 'Failed to create conversation');
    }

    return { conversationId: data.id, visitorId: vid };
  }

  async sendWidgetMessage(
    conversationId: string,
    message: string,
  ): Promise<{ reply: string; confidence: number }> {
    await this.ensureConversation(conversationId);
    return this.processMessage(conversationId, message);
  }

  async sendMessage(
    conversationId: string,
    _userId: string,
    message: string,
  ): Promise<{ reply: string; confidence: number }> {
    await this.ensureConversation(conversationId);
    return this.processMessage(conversationId, message);
  }

  private async processMessage(
    conversationId: string,
    message: string,
  ): Promise<{ reply: string; confidence: number }> {
    const sanitized = this.promptFilter.sanitize(message);
    const systemPrompt = await this.getSystemPrompt();
    const ragContext = await this.buildRagContext(sanitized);

    const history = await this.getHistory(conversationId);
    const messages: AIMessage[] = [
      {
        role: 'system',
        content: ragContext
          ? `${systemPrompt}\n\nRelevant knowledge:\n${ragContext}`
          : systemPrompt,
      },
      ...history
        .filter((m: { role: string }) => m.role === 'user' || m.role === 'assistant')
        .map((m: { role: string; content: string }) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      { role: 'user', content: sanitized },
    ];

    await this.storeMessage(conversationId, 'user', sanitized);

    const provider = this.aiFactory.getProvider();
    let response: AIResponse;
    try {
      response = await provider.generateCompletion(messages);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(`AI generation failed: ${msg}`);
      const fallback =
        'I apologize, but I am experiencing a temporary issue. Please try again or ask to speak with a human agent.';
      await this.storeMessage(conversationId, 'assistant', fallback);
      return { reply: fallback, confidence: 0 };
    }

    await this.storeMessage(
      conversationId,
      'assistant',
      response.content,
      response.usage?.totalTokens,
    );

    return { reply: response.content, confidence: 0.9 };
  }

  private async buildRagContext(query: string): Promise<string> {
    try {
      const results = await this.knowledgeService.search(query, 4);
      if (!results.length) return '';
      return results
        .map((r, i) => `[${i + 1}] ${r.text}`)
        .join('\n\n');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      this.logger.warn(`RAG search skipped: ${msg}`);
      return '';
    }
  }

  private async getSystemPrompt(): Promise<string> {
    try {
      const { data } = await this.supabase.client
        .from('settings')
        .select('value')
        .eq('key', 'system_prompt')
        .maybeSingle();

      const prompt = data?.value?.text ?? data?.value?.prompt;
      if (typeof prompt === 'string' && prompt.trim()) {
        return prompt.trim();
      }
    } catch {
      // use default
    }
    return DEFAULT_SYSTEM_PROMPT;
  }

  private async ensureConversation(conversationId: string) {
    const { data } = await this.supabase.client
      .from('conversations')
      .select('id')
      .eq('id', conversationId)
      .maybeSingle();

    if (!data) {
      throw new NotFoundException('Conversation not found');
    }
  }

  async getHistory(conversationId: string) {
    const { data } = await this.supabase.client
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    return data || [];
  }

  private async storeMessage(
    conversationId: string,
    role: string,
    content: string,
    tokens?: number,
  ) {
    await this.supabase.client.from('messages').insert({
      conversation_id: conversationId,
      role,
      content,
      confidence_score: role === 'assistant' ? (tokens ? 0.9 : null) : null,
      metadata: tokens ? { tokens } : {},
    });

    await this.supabase.client
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);
  }

  async escalate(conversationId: string, _userId?: string) {
    await this.supabase.client
      .from('conversations')
      .update({ status: 'escalated', updated_at: new Date().toISOString() })
      .eq('id', conversationId);
    return { status: 'escalated', message: 'Conversation escalated to human agent' };
  }
}
