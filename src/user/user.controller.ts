import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { UserService } from '@user/user.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @ApiOperation({ summary: 'Створення користувача' })
  @ApiResponse({ status: 201 })
  @Post()
  createUser(@Body() dto) {
    return this.userService.save(dto);
  }

  @ApiOperation({ summary: 'Отримання користувача по ID чи по email' })
  @ApiResponse({ status: 200 })
  @Get(':idOrEmail')
  findOneUser(@Param('idOrEmail') idOrEmail: string) {
    return this.userService.findOne(idOrEmail);
  }

  @ApiOperation({ summary: 'Видалення користувача' })
  @ApiResponse({ status: 204 })
  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: string) {
    return this.userService.delete(id);
  }
}
