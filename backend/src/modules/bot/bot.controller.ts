import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BotService } from './bot.service';

@Controller('bot')
export class BotController {
  constructor(private botService: BotService) {}

  @Get('branding')
  getBranding() {
    return this.botService.getBranding();
  }

  @Post('session')
  createSession(@Body() body: { visitorId?: string }) {
    return this.botService.createSession(body.visitorId);
  }

  @Post('message')
  sendMessage(@Body() body: { sessionId: string; message: string }) {
    return this.botService.sendMessage(body.sessionId, body.message);
  }

  @Get('history/:sessionId')
  getHistory(@Param('sessionId') sessionId: string) {
    return this.botService.getHistory(sessionId);
  }
}
