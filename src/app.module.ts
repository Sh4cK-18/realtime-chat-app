import { Module } from '@nestjs/common';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [WebsocketModule],
  controllers: [],
})
export class AppModule {}
