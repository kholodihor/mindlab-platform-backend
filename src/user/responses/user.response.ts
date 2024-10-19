import { Provider, Role, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserResponse implements User {
  id: number;
  name: string;
  email: string;
  avatar: string;

  @Exclude()
  password: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  provider: Provider;

  updateAt: Date;
  roles: Role[];

  constructor(user: User) {
    Object.assign(this, user);
  }
}
