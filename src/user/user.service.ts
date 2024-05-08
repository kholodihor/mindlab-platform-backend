import { ForbiddenException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashSync } from 'bcrypt';
import { Role, User } from '@prisma/client';
import { JwtPayload } from '../auth/interfaces';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { convertToSecondsUtil } from '../../libs/common/src/utils';

@Injectable()
export class UserService {
    constructor(
        private readonly prismaService: PrismaService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly configService: ConfigService,
    ) {}

    async save(user: Partial<User>) {
        const candidate = await this.findOne(user.email);
        if (candidate) {
            throw new HttpException('Користувач з такою поштою вжє інсує', HttpStatus.BAD_REQUEST);
        }

        const hashedPassword = user?.password ? this.hashPassword(user.password) : null;
        return this.prismaService.user.create({
            data: {
                email: user.email,
                name: user.name,
                password: hashedPassword,
                roles: ['USER'],
            },
        });
    }

    async findOne(idOrEmail: any, isReset = false) {
        if (isReset) await this.cacheManager.del(idOrEmail);
        const user = await this.cacheManager.get<User>(idOrEmail);
        if (!user) {
            const user = await this.prismaService.user.findFirst({
                where: {
                    OR: [
                        { id: isNaN(Number(idOrEmail)) ? undefined : Number(idOrEmail) },
                        { email: typeof idOrEmail === 'string' ? idOrEmail : undefined },
                    ],
                },
            });
            if (!user) return null;
            await this.cacheManager.set(
                idOrEmail,
                user,
                convertToSecondsUtil(this.configService.get<string>('JWT_EXP')),
            );
            return user;
        }
        return user;
    }

    async delete(id: string, user: JwtPayload) {
        if (user.id !== id && !user.roles.includes(Role.ADMIN)) {
            throw new ForbiddenException();
        }
        const candidate = await this.findOne(id);
        if (!candidate) {
            throw new HttpException('Користувача не знайдено', HttpStatus.BAD_REQUEST);
        }
        await Promise.all([this.cacheManager.del(id), this.cacheManager.del(candidate.email)]);
        return this.prismaService.user.delete({
            where: { id: Number(id) },
            select: { id: true },
        });
    }

    private hashPassword(password: string) {
        return hashSync(password, 10);
    }
}
