import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {
  }
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto);
    if (!user)
      throw new BadRequestException(`User with email ${dto.email} not created`);
  }
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const tokens = await this.authService.login(dto);
    if (!tokens)
      throw new BadRequestException(`User with email ${dto.email} not entered`);

    return { accessToken: tokens.accessToken };
  }

  @Get('refresh')
  refreshTokens() {}
}
