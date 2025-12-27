import { Repository } from 'typeorm';
import { UserEntity } from '../users.entity';
import { IUserRepository } from './user.repository.interface';
import { IUser } from '../interfaces/user.interface';

export class UserRepository
  extends Repository<UserEntity>
  implements IUserRepository
{
  async findByEmail(email: string): Promise<IUser | null> {
    return this.findOneBy({ email });
  }
}
