import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { SupabaseService } from '../core/database/supabase.service';
import { FlowDefinition } from './flow.types';

const SETTINGS_KEY = 'published_flow';

@Injectable()
export class FlowStoreService implements OnModuleInit {
  private readonly logger = new Logger(FlowStoreService.name);
  private cached: FlowDefinition | null = null;

  constructor(private supabase: SupabaseService) {}

  onModuleInit() {
    this.cached = this.loadBundledDefault();
  }

  private loadBundledDefault(): FlowDefinition {
    const path = join(__dirname, 'default-flow.json');
    try {
      return JSON.parse(readFileSync(path, 'utf-8')) as FlowDefinition;
    } catch {
      this.logger.warn('Using minimal fallback flow');
      return {
        id: 'main',
        name: 'Main Flow',
        nodes: [
          { id: 'start', type: 'start', data: {}, position: { x: 0, y: 0 } },
          {
            id: 'hello',
            type: 'message',
            data: { text: 'Hello! How can I help?' },
            position: { x: 200, y: 0 },
          },
          { id: 'end', type: 'end', data: {}, position: { x: 400, y: 0 } },
        ],
        edges: [
          { id: 'e1', source: 'start', target: 'hello' },
          { id: 'e2', source: 'hello', target: 'end' },
        ],
      };
    }
  }

  async getPublishedFlow(): Promise<FlowDefinition> {
    const bundled = this.cached ?? this.loadBundledDefault();
    const supabaseUrl = process.env.SUPABASE_URL?.trim();
    const supabaseKey =
      process.env.SUPABASE_SERVICE_KEY?.trim() || process.env.SUPABASE_KEY?.trim();

    if (!supabaseUrl || !supabaseKey) {
      return bundled;
    }

    try {
      const fromDb = await this.loadFromDatabaseWithTimeout(2500);
      if (fromDb) {
        this.cached = fromDb;
        return fromDb;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.warn(`Using bundled flow (database unavailable): ${msg}`);
    }

    return bundled;
  }

  private loadFromDatabaseWithTimeout(ms: number): Promise<FlowDefinition | null> {
    return Promise.race([
      this.loadFromDatabase(),
      new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('Supabase query timeout')), ms),
      ),
    ]);
  }

  private async loadFromDatabase(): Promise<FlowDefinition | null> {
    const { data, error } = await this.supabase.client
      .from('settings')
      .select('value')
      .eq('key', SETTINGS_KEY)
      .maybeSingle();

    if (error) {
      this.logger.warn(`settings query: ${error.message}`);
    }

    if (data?.value?.definition) {
      const def = data.value.definition as FlowDefinition;
      return { ...def, id: def.id || 'main', name: def.name || data.value.name || 'Main Flow' };
    }

    const { data: flowRow, error: flowErr } = await this.supabase.client
      .from('flows')
      .select('definition, name, id')
      .eq('is_published', true)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (flowErr) {
      this.logger.warn(`flows query: ${flowErr.message}`);
    }

    if (flowRow?.definition) {
      const def = flowRow.definition as FlowDefinition;
      return {
        id: flowRow.id,
        name: flowRow.name || 'Main Flow',
        nodes: def.nodes ?? [],
        edges: def.edges ?? [],
      };
    }

    return null;
  }

  async savePublishedFlow(definition: FlowDefinition): Promise<FlowDefinition> {
    const payload = {
      definition,
      name: definition.name,
      updated_at: new Date().toISOString(),
    };

    const { error } = await this.supabase.client.from('settings').upsert(
      {
        key: SETTINGS_KEY,
        value: payload,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'key' },
    );

    if (error) {
      this.logger.warn(`Settings upsert failed: ${error.message}`);
    }

    this.cached = definition;
    return definition;
  }
}
