import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';
import { AuthService } from './auth.service';
import { Tokens } from './interfaces';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { Cookie, UserAgent, Public } from '../../libs/common/src/decorators';
import { UserResponse } from '../user/responses';

const REFREST_TOKEN = 'refresh_token';

@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto);
    if (!user)
      throw new BadRequestException(`User with email ${dto.email} not created`);
    return new UserResponse(user);
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res() res: Response,
    @UserAgent() agent: string,
  ) {
    const tokens = await this.authService.login(dto, agent);
    if (!tokens)
      throw new BadRequestException(`User with email ${dto.email} not entered`);
    this.setRefreshTokenToCookies(tokens, res);
  }

  @Get('logout')
  async logout(@Cookie(REFREST_TOKEN) refreshToken: string, @Res() res: Response) {
    if (!refreshToken) {
      res.sendStatus(HttpStatus.NO_CONTENT);
      return;
    };
    await this.authService.deleteRefreshToken(refreshToken);
    res.cookie(REFREST_TOKEN, '', {
      httpOnly: true,
      secure: true,
      expires: new Date(),
    });
    res.sendStatus(HttpStatus.NO_CONTENT);
  }

  @Get('refresh-tokens')
  async refreshTokens(
    @Cookie(REFREST_TOKEN) refreshToken: string,
    @Res() res: Response,
    @UserAgent() agent: string,
  ) {
    if (!refreshToken) throw new UnauthorizedException();

    const tokens = await this.authService.refreshTokens(refreshToken, agent);
    if (!tokens) throw new UnauthorizedException();
    this.setRefreshTokenToCookies(tokens, res);
  }

  private setRefreshTokenToCookies(tokens: Tokens, res: Response) {
    if (!tokens) throw new UnauthorizedException();

    res.cookie(REFREST_TOKEN, tokens.refreshToken.token, {
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(tokens.refreshToken.exp),
      secure:
        this.configService.get('NODE_ENV', 'development') === 'production',
      path: '/',
    });
    res.status(HttpStatus.CREATED).json({ accessToken: tokens.accessToken });
  }
}
