import { Module } from '@nestjs/common';
import { BotController } from './bot.controller';
import { BotService } from './bot.service';
import { FlowsModule } from '../../flows/flows.module';
import { SupabaseService } from '../../core/database/supabase.service';

@Module({
  imports: [FlowsModule],
  controllers: [BotController],
  providers: [BotService, SupabaseService],
  exports: [BotService],
})
export class BotModule {}
