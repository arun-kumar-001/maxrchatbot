import { Controller, Post, Get, Param, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

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