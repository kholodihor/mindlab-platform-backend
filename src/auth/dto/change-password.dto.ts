import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    example: '25',
    description: 'ID of the user',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password of the user',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'password555',
    description: 'New password of the user',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}
