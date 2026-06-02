import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../core/database/supabase.service';

@Injectable()
export class AnalyticsService {
  constructor(private supabase: SupabaseService) {}

  async getStats() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const [totalChats, totalLeads, conversationsByDay, leadsByStatus] = await Promise.all([
      this.supabase.client.from('conversations').select('*', { count: 'exact', head: true }),
      this.supabase.client.from('leads').select('*', { count: 'exact', head: true }),
      this.supabase.client
        .from('conversations')
        .select('created_at')
        .gte('created_at', thirtyDaysAgo),
      this.supabase.client
        .from('leads')
        .select('status'),
    ]);

    const chatsByDay = this.groupByDate(conversationsByDay.data || []);
    const statusCounts = this.countByStatus(leadsByStatus.data || []);

    return {
      totalChats: totalChats.count || 0,
      totalLeads: totalLeads.count || 0,
      conversationsByDay: chatsByDay,
      leadsByStatus: statusCounts,
    };
  }

  private groupByDate(data: any[]) {
    const groups: Record<string, number> = {};
    for (const item of data) {
      const date = item.created_at?.split('T')[0];
      if (date) groups[date] = (groups[date] || 0) + 1;
    }
    return Object.entries(groups).map(([date, count]) => ({ date, count }));
  }

  private countByStatus(data: any[]) {
    const counts: Record<string, number> = {};
    for (const item of data) {
      const status = item.status || 'unknown';
      counts[status] = (counts[status] || 0) + 1;
    }
    return counts;
  }
}