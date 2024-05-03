import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserResponse } from './responses';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Створення користувача' })
  @ApiResponse({ status: 201 })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async createUser(@Body() dto) {
    const user = await this.userService.save(dto);
    return new UserResponse(user);
  }

  @ApiOperation({ summary: 'Отримання користувача по ID чи по email' })
  @ApiResponse({ status: 200 })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':idOrEmail')
  async findOneUser(@Param('idOrEmail') idOrEmail: string) {
    const user = await this.userService.findOne(idOrEmail);
    return new UserResponse(user);
  }

  @ApiOperation({ summary: 'Видалення користувача' })
  @ApiResponse({ status: 204 })
  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: string) {
    await this.userService.delete(id);
    throw new HttpException(null, HttpStatus.NO_CONTENT);
  }
}
