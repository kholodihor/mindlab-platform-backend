import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { options } from './config';
import { STRATEGIES } from '../strategies';
import { GUARDS } from './guards';
import { HttpModule } from '@nestjs/axios';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, ...STRATEGIES, ...GUARDS],
  imports: [
    PassportModule,
    JwtModule.registerAsync(options()),
    UserModule,
    HttpModule,
    CloudinaryModule,
  ],
})
export class AuthModule {}
