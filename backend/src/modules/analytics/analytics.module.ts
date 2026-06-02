import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { SupabaseService } from '../../core/database/supabase.service';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService, SupabaseService],
})
export class AnalyticsModule {}