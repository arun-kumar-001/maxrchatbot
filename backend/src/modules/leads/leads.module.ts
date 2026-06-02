import { Module } from '@nestjs/common';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { SupabaseService } from '../../core/database/supabase.service';

@Module({
  controllers: [LeadsController],
  providers: [LeadsService, SupabaseService],
  exports: [LeadsService],
})
export class LeadsModule {}