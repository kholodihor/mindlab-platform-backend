import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  providers: [EventsService],
  exports: [EventsService],
  controllers: [EventsController],
  imports: [CacheModule.register()],
})
export class EventsModule {}
