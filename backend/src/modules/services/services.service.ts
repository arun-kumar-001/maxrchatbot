import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../../core/database/supabase.service';

@Injectable()
export class ServicesService {
  private readonly logger = new Logger(ServicesService.name);
  constructor(private supabase: SupabaseService) {}

  async findAll() {
    const { data } = await this.supabase.client
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });
    return data || [];
  }

  async findOne(id: string) {
    const { data } = await this.supabase.client
      .from('services')
      .select('*')
      .eq('id', id)
      .single();
    return data;
  }

  async create(data: { title: string; description: string; pricing?: string; benefits?: string[]; use_cases?: string[]; faqs?: any }) {
    const { data: service, error } = await this.supabase.client
      .from('services')
      .insert(data)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return service;
  }

  async update(id: string, data: any) {
    const { data: service, error } = await this.supabase.client
      .from('services')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return service;
  }

  async remove(id: string) {
    const { error } = await this.supabase.client
      .from('services')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
    return { deleted: true };
  }
}