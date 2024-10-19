import { Provider, Role, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserResponse implements User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  updateAt: Date;
  roles: Role[];

  @Exclude()
  password: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  provider: Provider;

  constructor(user: User) {
    Object.assign(this, user);
  }
}
