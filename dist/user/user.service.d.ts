import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserService {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    create(createUserDto: CreateUserDto): Promise<{
        user: {
            email: string;
            password: string;
        } & User;
        token: string;
    }>;
    findOne(email: string): Promise<User>;
    updateUser(id: number, updateUserDto: UpdateUserDto): Promise<any>;
    updatePassword(email: string, updateUserDto: UpdateUserDto): Promise<any>;
}
