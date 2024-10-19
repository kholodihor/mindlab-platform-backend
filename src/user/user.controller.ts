import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { UserResponse } from './responses';
import { CurrentUser } from '../../libs/common/src/decorators';
import { JwtPayload } from '../auth/interfaces';
import { RolesGuard } from '../auth/guards/role.guard';

@ApiTags('Users')
@Controller('user')
@ApiSecurity('JWT-auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
  async deleteUser(
    @Param('id', ParseIntPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    await this.userService.delete(id, user);
    throw new HttpException(null, HttpStatus.NO_CONTENT);
  }

  @ApiOperation({ summary: 'Отримання поточного користувача' })
  @ApiResponse({ status: 200 })
  @UseGuards(RolesGuard)
  @Get('me')
  async me(@CurrentUser() user: JwtPayload) {
    return user;
  }
}
