import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Event } from '@prisma/client';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { convertToSecondsUtil } from '../../libs/common/src/utils';

@Injectable()
export class EventsService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
    private readonly configService: ConfigService,
  ) {}

  async create(event: Event) {
    if (!event) {
      throw new HttpException(
        'Невалідні дані для створення події',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newEvent = await this.prismaService.event.create({
      data: {
        title: event.title,
        subitle: event.subitle,
        text: event.text,
        imageUrl: event.imageUrl,
        category: event.category,
      },
    });
    return newEvent;
  }

  findAll() {
    return this.prismaService.event.findMany();
  }

  async findOne(id: string) {
    const event = await this.cacheManager.get<Event>(id);
    if (!event) {
      const event = await this.prismaService.event.findUnique({
        where: { id },
      });
      if (!event) return null;
      await this.cacheManager.set(
        id,
        event,
        convertToSecondsUtil(this.configService.get<string>('JWT_EXP')),
      );
      return event;
    }
    return event;
  }

  async update(id: string, event: Partial<Event>) {
    const existingEvent = await this.prismaService.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      throw new HttpException(
        `Event with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedEvent = await this.prismaService.event.update({
      where: { id },
      data: {
        ...existingEvent,
        ...event,
      },
    });

    return updatedEvent;
  }

  async delete(id: string) {
    const event = await this.prismaService.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new HttpException(
        `Event with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.cacheManager.del(id);
    return this.prismaService.event.delete({
      where: { id },
      select: { id: true },
    });
  }
}
