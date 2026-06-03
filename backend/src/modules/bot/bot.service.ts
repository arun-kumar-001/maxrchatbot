import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { SupabaseService } from '../../core/database/supabase.service';
import { FlowEngineService } from '../../flows/flow-engine.service';
import { FlowStoreService } from '../../flows/flow-store.service';
import { FlowState, BotReplyMessage } from '../../flows/flow.types';

@Injectable()
export class BotService {
  private readonly logger = new Logger(BotService.name);

  constructor(
    private supabase: SupabaseService,
    private flowStore: FlowStoreService,
    private flowEngine: FlowEngineService,
  ) {}

  async createSession(visitorId?: string) {
    const vid = visitorId || randomUUID();
    const flow = await this.flowStore.getPublishedFlow();

    const { data, error } = await this.supabase.client
      .from('conversations')
      .insert({
        source: 'webchat',
        status: 'active',
        metadata: {
          visitor_id: vid,
          flow_id: flow.id,
          flow_state: this.flowEngine.createInitialState(flow),
        },
      })
      .select('id')
      .single();

    if (error || !data) {
      throw new Error(error?.message || 'Failed to create session');
    }

    const turn = await this.flowEngine.startConversation(flow);
    await this.persistFlowState(data.id, turn.state);
    await this.storeBotMessages(data.id, turn.messages);

    if (turn.escalated) {
      await this.escalate(data.id);
    }

    return {
      sessionId: data.id,
      visitorId: vid,
      messages: this.formatOutgoing(turn.messages),
    };
  }

  async sendMessage(sessionId: string, text: string) {
    const conversation = await this.getConversation(sessionId);
    const flow = await this.flowStore.getPublishedFlow();
    const state: FlowState =
      conversation.metadata?.flow_state ?? this.flowEngine.createInitialState(flow);

    await this.storeMessage(sessionId, 'user', text);

    const turn = await this.flowEngine.handleUserInput(flow, state, text);
    await this.persistFlowState(sessionId, turn.state);
    await this.storeBotMessages(sessionId, turn.messages);

    if (turn.escalated) {
      await this.escalate(sessionId);
    }

    return { messages: this.formatOutgoing(turn.messages), state: turn.state };
  }

  async getHistory(sessionId: string) {
    const { data } = await this.supabase.client
      .from('messages')
      .select('*')
      .eq('conversation_id', sessionId)
      .order('created_at', { ascending: true });
    return (data || []).map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      createdAt: m.created_at,
      metadata: m.metadata,
    }));
  }

  async getBranding() {
    const { data } = await this.supabase.client
      .from('settings')
      .select('value')
      .eq('key', 'branding')
      .maybeSingle();

    const defaults = {
      bot_name: 'Assistant',
      primary_color: '#ffffff',
      accent_color: '#111827',
      logo_url: '',
    };

    return { ...defaults, ...(data?.value ?? {}) };
  }

  private formatOutgoing(messages: BotReplyMessage[]) {
    return messages
      .filter((m) => m.type === 'text' ? m.content.trim() : true)
      .map((m, i) => ({
        id: `bot-${Date.now()}-${i}`,
        role: 'assistant' as const,
        type: m.type,
        content: m.type === 'text' ? m.content : m.content || 'Choose an option:',
        choices: m.choices,
      }));
  }

  private async storeBotMessages(sessionId: string, messages: BotReplyMessage[]) {
    for (const m of messages) {
      if (m.type === 'text' && !m.content.trim()) continue;
      const content =
        m.type === 'text' ? m.content : m.content?.trim() ? m.content : 'Choose an option:';
      await this.storeMessage(sessionId, 'assistant', content, {
        type: m.type,
        choices: m.choices,
      });
    }
  }

  private async storeMessage(
    sessionId: string,
    role: string,
    content: string,
    metadata?: Record<string, unknown>,
  ) {
    await this.supabase.client.from('messages').insert({
      conversation_id: sessionId,
      role,
      content,
      metadata: metadata ?? {},
    });
    await this.supabase.client
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', sessionId);
  }

  private async persistFlowState(sessionId: string, state: FlowState) {
    const conv = await this.getConversation(sessionId);
    await this.supabase.client
      .from('conversations')
      .update({
        metadata: { ...conv.metadata, flow_state: state },
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId);
  }

  private async getConversation(sessionId: string) {
    const { data } = await this.supabase.client
      .from('conversations')
      .select('*')
      .eq('id', sessionId)
      .maybeSingle();
    if (!data) throw new NotFoundException('Session not found');
    return data;
  }

  private async escalate(sessionId: string) {
    await this.supabase.client
      .from('conversations')
      .update({ status: 'escalated', updated_at: new Date().toISOString() })
      .eq('id', sessionId);
  }
}
