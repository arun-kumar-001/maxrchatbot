import { Body, Controller, Get, Put } from '@nestjs/common';
import { FlowDefinition } from './flow.types';
import { FlowStoreService } from './flow-store.service';

@Controller('studio/flow')
export class FlowsController {
  constructor(private flowStore: FlowStoreService) {}

  @Get()
  getFlow() {
    return this.flowStore.getPublishedFlow();
  }

  @Put()
  saveFlow(@Body() body: FlowDefinition) {
    return this.flowStore.savePublishedFlow(body);
  }
}
