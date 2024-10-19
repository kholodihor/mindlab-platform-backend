import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Event } from '@prisma/client';

@ApiTags('Events')
@Controller('events')
@UseInterceptors(ClassSerializerInterceptor)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiOperation({ summary: 'Create a new event' })
  @ApiResponse({
    status: 201,
    description: 'The event has been successfully created.',
    type: Event,
  })
  @ApiResponse({ status: 400, description: 'Invalid data for creating event.' })
  @Post()
  async createEvent(@Body() event: Event) {
    return this.eventsService.create(event);
  }

  @ApiOperation({ summary: 'Retrieve all events' })
  @ApiResponse({
    status: 200,
    description: 'List of events retrieved successfully.',
    type: [Event],
  })
  @Get()
  async findAllEvents() {
    return this.eventsService.findAll();
  }

  @ApiOperation({ summary: 'Retrieve a specific event by ID' })
  @ApiResponse({
    status: 200,
    description: 'Event retrieved successfully.',
    type: Event,
  })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  @Get(':id')
  async findOneEvent(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update an existing event' })
  @ApiResponse({
    status: 200,
    description: 'The event has been successfully updated.',
    type: Event,
  })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  @Patch(':id')
  async updateEvent(@Param('id') id: string, @Body() event: Partial<Event>) {
    return this.eventsService.update(id, event);
  }

  @ApiOperation({ summary: 'Delete an event by ID' })
  @ApiResponse({
    status: 204,
    description: 'The event has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  @Delete(':id')
  async deleteEvent(@Param('id') id: string) {
    await this.eventsService.delete(id);
    throw new HttpException(null, HttpStatus.NO_CONTENT);
  }
}
