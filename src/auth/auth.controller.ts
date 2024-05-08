import {
    BadRequestException,
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    HttpStatus,
    Post,
    Query,
    Req,
    Res,
    UnauthorizedException,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';
import { AuthService } from './auth.service';
import { Tokens } from './interfaces';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { Cookie, Public, UserAgent } from '../../libs/common/src/decorators';
import { UserResponse } from '../user/responses';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GoogleGuard } from './guards/google.guard';
import { HttpService } from '@nestjs/axios';
import { map, mergeMap } from 'rxjs';
import { handleTimeoutAndErrors } from '../../libs/common/src/helpers';

const REFREST_TOKEN = 'refresh_token';

@ApiTags('Auth')
@Public()
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {}

    @ApiOperation({ summary: 'Реєстрація нового користувача' })
    @ApiResponse({ status: 201 })
    @ApiBody({ type: RegisterDto })
    @UseInterceptors(ClassSerializerInterceptor)
    @Post('register')
    async register(@Body() dto: RegisterDto) {
        const user = await this.authService.register(dto);
        if (!user) throw new BadRequestException(`User with email ${dto.email} not created`);
        return new UserResponse(user);
    }

    @ApiOperation({ summary: 'Логін користувача' })
    @ApiResponse({ status: 201 })
    @ApiBody({ type: LoginDto })
    @Post('login')
    async login(@Body() dto: LoginDto, @Res() res: Response, @UserAgent() agent: string) {
        const tokens = await this.authService.login(dto, agent);
        if (!tokens) throw new BadRequestException(`User with email ${dto.email} not entered`);
        this.setRefreshTokenToCookies(tokens, res);
    }

    @ApiOperation({ summary: 'Логаут користувача' })
    @ApiResponse({ status: 200 })
    @Get('logout')
    async logout(@Cookie(REFREST_TOKEN) refreshToken: string, @Res() res: Response) {
        if (!refreshToken) {
            res.sendStatus(HttpStatus.NO_CONTENT);
            return;
        }
        await this.authService.deleteRefreshToken(refreshToken);
        res.cookie(REFREST_TOKEN, '', {
            httpOnly: true,
            secure: true,
            expires: new Date(),
        });
        res.sendStatus(HttpStatus.NO_CONTENT);
    }

    @ApiOperation({ summary: 'Отримання рефреш токена' })
    @ApiResponse({ status: 200 })
    @Get('refresh-tokens')
    async refreshTokens(@Cookie(REFREST_TOKEN) refreshToken: string, @Res() res: Response, @UserAgent() agent: string) {
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
            secure: this.configService.get('NODE_ENV', 'development') === 'production',
            path: '/',
        });
        res.status(HttpStatus.CREATED).json({ accessToken: tokens.accessToken });
    }

    @UseGuards(GoogleGuard)
    @Get('google')
    googleAuth() {}

    @UseGuards(GoogleGuard)
    @Get('google/callback')
    googleAuthCallback(@Req() req: Request, @Res() res: Response) {
        const token = req.user['accessToken'];
        return res.redirect(`http://localhost:4000/auth/success?token=${token}`); // редирект на фронт для обробки
    }

    // фронтовий url з його доменом
    @Get('success')
    success(@Query('token') token: string, @UserAgent() agent: string, @Res() res: Response) {
        return this.httpService.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`).pipe(
            mergeMap(({ data: { email } }) => this.authService.googleAuth(email, agent)),
            map((data) => this.setRefreshTokenToCookies(data, res)),
            handleTimeoutAndErrors(),
        );
    }
}
