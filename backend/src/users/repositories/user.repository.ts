import { Repository } from 'typeorm';
import { UserEntity } from '../users.entity';
import { IUserRepository } from './user.repository.interface';
import { IUser } from '../interfaces/user.interface';
import { ICreateUser } from '../interfaces/create-user.interface';

export class UserRepository
  extends Repository<UserEntity>
  implements IUserRepository
{
  createAndSave(data: ICreateUser): Promise<IUser> {
    const user = this.create({
      fullName: data.fullName,
      nickName: data.nickName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      passwordHash: data.password,
      avatarUrl: data.avatarUrl,
    });

    return this.save(user);
  }

  async findOneByEmail(email: string): Promise<IUser | null> {
    return this.findOneBy({ email });
  }

  async findOneByNickname(nickname: string): Promise<IUser | null> {
    return this.findOneBy({ nickName: nickname });
  }

  async findOneByEmailOrNickname(
    emailOrNickname: string,
  ): Promise<IUser | null> {
    return this.findOne({
      where: [{ email: emailOrNickname }, { nickName: emailOrNickname }],
    });
  }
}
