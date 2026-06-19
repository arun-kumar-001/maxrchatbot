import { Injectable, Logger } from '@nestjs/common';
import { AIFactory } from '../../core/ai/ai.factory';
import { AIMessage, AIResponse } from '../../core/ai/ai.interface';
import { PromptInjectionFilter } from '../../core/security/prompt-injection.filter';
import { SupabaseService } from '../../core/database/supabase.service';
import { KnowledgeService } from '../knowledge/knowledge.service';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private aiFactory: AIFactory,
    private promptFilter: PromptInjectionFilter,
    private supabase: SupabaseService,
    private knowledge: KnowledgeService,
  ) {}

  async sendMessage(
    conversationId: string,
    userId: string,
    message: string,
  ): Promise<{ reply: string; confidence: number }> {
    const sanitized = this.promptFilter.sanitize(message);

    // Retrieve relevant knowledge-base context (RAG). Degrades gracefully to
    // no context if the vector store is unavailable.
    const context = await this.retrieveContext(sanitized);

    const systemPrompt =
      'You are MAXR Assistant, an AI customer support chatbot for MAXR. ' +
      'Be helpful, concise, and professional. If you need more information, ask clarifying questions.' +
      (context
        ? '\n\nUse the following MAXR knowledge base context to answer the question. ' +
          'If the answer is not in the context, say what you do know and offer to connect the user with the team.\n\n' +
          `--- KNOWLEDGE BASE ---\n${context}\n--- END ---`
        : '');

    // Get conversation history
    const history = await this.getHistory(conversationId);
    const messages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      ...history.map((m: any) => ({ role: m.role, content: m.content })),
      { role: 'user', content: sanitized },
    ];

    // Store user message
    await this.storeMessage(conversationId, 'user', sanitized);

    // Generate AI response
    // Generate AI response with automatic provider fallback
    // (primary provider → fallback chain on 429 / quota / outage).
    let response: AIResponse;
    try {
      response = await this.aiFactory.generateWithFallback(messages);
    } catch (err: any) {
      this.logger.error(`AI generation failed: ${err.message}`);
      await this.storeMessage(conversationId, 'assistant', 'I apologize, but I am experiencing a temporary issue. Please try again or escalate to a human agent.');
      return { reply: 'I apologize, but I am experiencing a temporary issue. Please try again or escalate to a human agent.', confidence: 0 };
    }

    // Store AI response
    await this.storeMessage(conversationId, 'assistant', response.content, response.usage?.totalTokens);

    return { reply: response.content, confidence: 0.9 };
  }

  /**
   * Stateless, public chat reply for the anonymous website widget.
   * Same RAG-grounded prompt as sendMessage, but takes history inline and does
   * not require auth or persist anything.
   */
  async publicReply(
    message: string,
    history: AIMessage[] = [],
  ): Promise<{ reply: string; confidence: number }> {
    const sanitized = this.promptFilter.sanitize(message);
    const context = await this.retrieveContext(sanitized);

    const systemPrompt =
      'You are MAXR Assistant, an AI customer support chatbot for MAXR. ' +
      'Be helpful, concise, and professional. If you need more information, ask clarifying questions.' +
      (context
        ? '\n\nUse the following MAXR knowledge base context to answer the question. ' +
          'If the answer is not in the context, say what you do know and offer to connect the user with the team.\n\n' +
          `--- KNOWLEDGE BASE ---\n${context}\n--- END ---`
        : '');

    const recent = history
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .slice(-10);

    const messages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      ...recent,
      { role: 'user', content: sanitized },
    ];

    try {
      const response = await this.aiFactory.generateWithFallback(messages);
      return { reply: response.content, confidence: 0.9 };
    } catch (err: any) {
      this.logger.error(`Public AI generation failed: ${err.message}`);
      return {
        reply:
          'I apologize, but I am experiencing a temporary issue. Please try again in a moment, or contact us at sales@maxr.io.',
        confidence: 0,
      };
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

  /**
   * Retrieve top knowledge-base chunks relevant to the user's message and
   * format them as context. Returns an empty string (and never throws) when
   * RAG is disabled or no relevant content is found, so chat keeps working.
   */
  private async retrieveContext(query: string, limit = 6): Promise<string> {
    try {
      const results = await this.knowledge.search(query, limit);
      if (!results || results.length === 0) return '';
      return results
        .map((r: any, i: number) => `[${i + 1}] ${r.text}`)
        .join('\n\n');
    } catch (err: any) {
      this.logger.warn(`RAG context retrieval failed: ${err?.message || err}`);
      return '';
    }
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