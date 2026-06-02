import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../../core/database/supabase.service';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);
  constructor(private supabase: SupabaseService) {}

  async getConversations(status?: string) {
    let query = this.supabase.client
      .from('conversations')
      .select('*, messages(count), leads(*)')
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);

    const { data } = await query;
    return data || [];
  }

  async getDashboard() {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

    const [activeConversations, totalLeads, totalConversations, todayChats] = await Promise.all([
      this.supabase.client.from('conversations').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      this.supabase.client.from('leads').select('*', { count: 'exact', head: true }),
      this.supabase.client.from('conversations').select('*', { count: 'exact', head: true }),
      this.supabase.client.from('conversations').select('*', { count: 'exact', head: true }).gte('created_at', todayStart),
    ]);

    return {
      activeChats: activeConversations.count || 0,
      totalLeads: totalLeads.count || 0,
      totalConversations: totalConversations.count || 0,
      todayChats: todayChats.count || 0,
    };
  }

  async takeover(conversationId: string, adminId: string) {
    const { data, error } = await this.supabase.client
      .from('conversations')
      .update({ status: 'active', metadata: { admin_id: adminId, takeover_at: new Date().toISOString() } })
      .eq('id', conversationId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async resolveConversation(conversationId: string) {
    const { data, error } = await this.supabase.client
      .from('conversations')
      .update({ status: 'resolved', updated_at: new Date().toISOString() })
      .eq('id', conversationId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }
}