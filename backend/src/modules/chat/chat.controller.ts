import { Controller, Post, Get, Param, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('widget/conversations')
  createWidgetConversation(@Body() body: { visitorId?: string }) {
    return this.chatService.createWidgetConversation(body.visitorId);
  }

  @Post('widget/message')
  sendWidgetMessage(@Body() body: { conversationId: string; message: string }) {
    return this.chatService.sendWidgetMessage(body.conversationId, body.message);
  }

  @Get('widget/history/:conversationId')
  getWidgetHistory(@Param('conversationId') conversationId: string) {
    return this.chatService.getHistory(conversationId);
  }

  @Post('widget/escalate')
  escalateWidget(@Body() body: { conversationId: string }) {
    return this.chatService.escalate(body.conversationId);
  }

  @Post('message')
  @UseGuards(AuthGuard('jwt'))
  async sendMessage(@Body() body: { conversationId: string; message: string }, @Req() req: any) {
    return this.chatService.sendMessage(body.conversationId, req.user.id, body.message);
  }

  @Get('history/:conversationId')
  @UseGuards(AuthGuard('jwt'))
  async getHistory(@Param('conversationId') conversationId: string) {
    return this.chatService.getHistory(conversationId);
  }

  @Post('escalate')
  @UseGuards(AuthGuard('jwt'))
  async escalate(@Body() body: { conversationId: string }, @Req() req: any) {
    return this.chatService.escalate(body.conversationId, req.user.id);
  }
}