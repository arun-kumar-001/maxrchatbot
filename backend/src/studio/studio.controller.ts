import { Body, Controller, Get, Post } from '@nestjs/common';
import { SupabaseService } from '../core/database/supabase.service';
import { KnowledgeService } from '../modules/knowledge/knowledge.service';

@Controller('studio')
export class StudioController {
  constructor(
    private supabase: SupabaseService,
    private knowledge: KnowledgeService,
  ) {}

  @Get('conversations')
  async getConversations() {
    if (!this.hasSupabase()) return [];
    try {
      const { data } = await this.withTimeout(
        this.supabase.client
          .from('conversations')
          .select('*, messages(id, content, role, created_at)')
          .order('updated_at', { ascending: false })
          .limit(50),
        3000,
      );
      return data || [];
    } catch {
      return [];
    }
  }

  @Get('analytics')
  async getAnalytics() {
    if (!this.hasSupabase()) {
      return {
        totalConversations: 0,
        activeChats: 0,
        escalated: 0,
        totalLeads: 0,
      };
    }
    try {
      const [total, active, escalated, leads] = await this.withTimeout(
        Promise.all([
          this.supabase.client.from('conversations').select('*', { count: 'exact', head: true }),
          this.supabase.client.from('conversations').select('*', { count: 'exact', head: true }).eq('status', 'active'),
          this.supabase.client.from('conversations').select('*', { count: 'exact', head: true }).eq('status', 'escalated'),
          this.supabase.client.from('leads').select('*', { count: 'exact', head: true }),
        ]),
        3000,
      );
      return {
        totalConversations: total.count ?? 0,
        activeChats: active.count ?? 0,
        escalated: escalated.count ?? 0,
        totalLeads: leads.count ?? 0,
      };
    } catch {
      return {
        totalConversations: 0,
        activeChats: 0,
        escalated: 0,
        totalLeads: 0,
      };
    }
  }

  private hasSupabase() {
    return Boolean(process.env.SUPABASE_URL?.trim() && (process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY));
  }

  private withTimeout<T>(promise: PromiseLike<T>, ms: number): Promise<T> {
    return Promise.race([
      Promise.resolve(promise),
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), ms),
      ),
    ]);
  }

  @Get('knowledge')
  listKnowledge() {
    return this.knowledge.findAll();
  }

  @Post('knowledge')
  uploadKnowledge(@Body() body: { title: string; content: string }) {
    return this.knowledge.upload(body.content, body.title);
  }
}
