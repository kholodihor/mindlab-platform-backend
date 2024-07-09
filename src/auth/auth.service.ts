import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';
import { UserService } from '../user/user.service';
import { Provider, Token, User } from '@prisma/client';
import { Tokens } from './interfaces';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { v4 } from 'uuid';
import { add } from 'date-fns';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async refreshTokens(refreshToken: string, agent: string): Promise<Tokens> {
    const token = await this.prismaService.token.findUnique({
      where: { token: refreshToken },
    });
    if (!token) throw new UnauthorizedException();
    await this.prismaService.token.delete({ where: { token: refreshToken } });
    if (new Date(token.exp) < new Date()) throw new UnauthorizedException();
    const user = await this.usersService.findOne(token.userId);
    return this.generateTokens(user, agent);
  }

  async register(dto: RegisterDto) {
    return this.usersService.save(dto).catch((err) => {
      this.logger.error(err);
      return null;
    });
  }

  async login(dto: LoginDto, agent: string): Promise<Tokens> {
    const user: User = await this.usersService
      .findOne(dto.email, true)
      .catch((err) => {
        this.logger.error(err);
        return null;
      });
    if (!user || !compareSync(dto.password, user.password))
      throw new UnauthorizedException('Incorrect email or password');

    return this.generateTokens(user, agent);
  }

  private async generateTokens(user: User, agent: string): Promise<Tokens> {
    const accessToken =
      'Bearer ' +
      this.jwtService.sign({
        id: user.id,
        email: user.email,
        roles: user.roles,
      });

    const refreshToken = await this.getRefreshToken(user.id, agent);
    return {
      accessToken,
      refreshToken,
    };
  }

  private async getRefreshToken(userId: number, agent: string): Promise<Token> {
    const _token = await this.prismaService.token.findFirst({
      where: { userId, userAgent: agent },
    });
    const token = _token?.token ?? '';
    return this.prismaService.token.upsert({
      where: { token },
      update: {
        token: v4(),
        exp: add(new Date(), { months: 1 }),
      },
      create: {
        token: v4(),
        exp: add(new Date(), { months: 1 }),
        userId,
        userAgent: agent,
      },
    });
  }

  async deleteRefreshToken(token: string) {
    return this.prismaService.token.delete({ where: { token } });
  }

  async googleAuth(email: string, agent: string) {
    const userExist = await this.usersService.findOne(email);
    if (userExist) return this.generateTokens(userExist, agent);

    const user = await this.usersService
      .save({ email, provider: Provider.GOOGLE })
      .catch((err) => {
        this.logger.error(err);
        return null;
      });
    if (!user)
      throw new HttpException(
        `User with email ${email} not created in Google auth`,
        HttpStatus.BAD_REQUEST,
      );
    return this.generateTokens(user, agent);
  }
}
