import { Controller, Get, Post, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('conversations')
  getConversations(@Query('status') status?: string) {
    return this.adminService.getConversations(status);
  }

  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboard();
  }

  @Post('takeover')
  @HttpCode(HttpStatus.OK)
  takeover(@Body() body: { conversationId: string; adminId: string }) {
    return this.adminService.takeover(body.conversationId, body.adminId);
  }

  @Post('resolve/:conversationId')
  @HttpCode(HttpStatus.OK)
  resolve(@Param('conversationId') conversationId: string) {
    return this.adminService.resolveConversation(conversationId);
  }
}