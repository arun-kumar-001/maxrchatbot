import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { ChatModule } from './modules/chat/chat.module';
import { LeadsModule } from './modules/leads/leads.module';
import { ServicesModule } from './modules/services/services.module';
import { KnowledgeModule } from './modules/knowledge/knowledge.module';
import { AdminModule } from './modules/admin/admin.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { HealthModule } from './modules/health/health.module';
import { FlowsModule } from './flows/flows.module';
import { BotModule } from './modules/bot/bot.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),
    FlowsModule,
    BotModule,
    AuthModule,
    ChatModule,
    LeadsModule,
    ServicesModule,
    KnowledgeModule,
    AdminModule,
    AnalyticsModule,
    HealthModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}