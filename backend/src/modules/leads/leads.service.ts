import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../../core/database/supabase.service';

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);
  constructor(private supabase: SupabaseService) {}

  async create(data: {
    conversation_id: string;
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    service_interest?: string;
    budget?: string;
    notes?: string;
  }) {
    const { data: lead, error } = await this.supabase.client
      .from('leads')
      .insert({ ...data, status: 'new' })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return lead;
  }

  async findAll() {
    const { data } = await this.supabase.client
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    return data || [];
  }

  async getStats() {
    const { count: total } = await this.supabase.client
      .from('leads')
      .select('*', { count: 'exact', head: true });

    const { data: all } = await this.supabase.client
      .from('leads')
      .select('status');

    const counts: Record<string, number> = { new: 0, qualified: 0, contacted: 0, converted: 0, closed: 0 };
    (all || []).forEach((l: any) => { if (counts[l.status] !== undefined) counts[l.status]++; });

    return { total: total || 0, byStatus: counts };
  }

  async update(id: string, data: Partial<{ status: string; notes: string; name: string; email: string; phone: string; company: string }>) {
    const { data: lead, error } = await this.supabase.client
      .from('leads')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return lead;
  }
}