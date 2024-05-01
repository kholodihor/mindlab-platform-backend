import { Injectable } from '@nestjs/common';
import {PrismaService} from "@prisma/prisma.service";
import {User} from "@prisma/client";
import {hashSync} from "bcrypt";

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}

    async save(user: Partial<User>) {
        const hashedPassword = this.hashPassword(user.password);
        return this.prismaService.user.create({
            data: {
                email: user.email,
                name: user.name,
                password: hashedPassword,
                roles: ['USER']
            }
        });
    }
    async findOne(idOrEmail: string) {
        return this.prismaService.user.findFirst({
            where: {
                OR: [
                    { id: isNaN(Number(idOrEmail)) ? undefined : Number(idOrEmail) },
                    {email: idOrEmail}
                ]
            }
        });
    }
    async delete(id: string) {
        return this.prismaService.user.delete({
            where: {
                id: Number(id)
            }
        });
    }

    private hashPassword(password: string) {
        return hashSync(password, 10);
    }


}
