import { Module } from '@nestjs/common';
import { WebsocketGateway } from './webscoket.gateway';

@Module({
  providers: [WebsocketGateway],
})
export class WebsocketModule {}
