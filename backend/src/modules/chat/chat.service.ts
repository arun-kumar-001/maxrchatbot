import { Injectable, Logger } from '@nestjs/common';
import { AIFactory } from '../../core/ai/ai.factory';
import { AIMessage, AIResponse } from '../../core/ai/ai.interface';
import { PromptInjectionFilter } from '../../core/security/prompt-injection.filter';
import { SupabaseService } from '../../core/database/supabase.service';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private aiFactory: AIFactory,
    private promptFilter: PromptInjectionFilter,
    private supabase: SupabaseService,
  ) {}

  async sendMessage(
    conversationId: string,
    userId: string,
    message: string,
  ): Promise<{ reply: string; confidence: number }> {
    const sanitized = this.promptFilter.sanitize(message);

    // Get conversation history
    const history = await this.getHistory(conversationId);
    const messages: AIMessage[] = [
      { role: 'system', content: 'You are MAXR Assistant, an AI customer support chatbot for MAXR. Be helpful, concise, and professional. If you need more information, ask clarifying questions.' },
      ...history.map((m: any) => ({ role: m.role, content: m.content })),
      { role: 'user', content: sanitized },
    ];

    // Store user message
    await this.storeMessage(conversationId, 'user', sanitized);

    // Generate AI response
    const provider = this.aiFactory.getProvider();
    let response: AIResponse;
    try {
      response = await provider.generateCompletion(messages);
    } catch (err: any) {
      this.logger.error(`AI generation failed: ${err.message}`);
      await this.storeMessage(conversationId, 'assistant', 'I apologize, but I am experiencing a temporary issue. Please try again or escalate to a human agent.');
      return { reply: 'I apologize, but I am experiencing a temporary issue. Please try again or escalate to a human agent.', confidence: 0 };
    }

    // Store AI response
    await this.storeMessage(conversationId, 'assistant', response.content, response.usage?.totalTokens);

    return { reply: response.content, confidence: 0.9 };
  }

  async getHistory(conversationId: string) {
    const { data } = await this.supabase.client
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    return data || [];
  }

  private async storeMessage(conversationId: string, role: string, content: string, tokens?: number) {
    await this.supabase.client.from('messages').insert({
      conversation_id: conversationId,
      role,
      content,
      confidence_score: role === 'assistant' ? (tokens ? 0.9 : null) : null,
      metadata: tokens ? { tokens } : {},
    });
  }

  async escalate(conversationId: string, userId: string) {
    await this.supabase.client
      .from('conversations')
      .update({ status: 'escalated', updated_at: new Date().toISOString() })
      .eq('id', conversationId);
    return { status: 'escalated', message: 'Conversation escalated to human agent' };
  }
}