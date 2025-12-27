import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import type { ICreateUser } from './interfaces/create-user.interface';
import type { IUser } from './interfaces/user.interface';
import type { IUserRepository } from './repositories/user.repository.interface';
import { USERS_REPOSITORY_TOKEN } from './user.provider';

@Injectable()
export class UserService {
  constructor(
    @Inject(USERS_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    private readonly logger: Logger,
  ) {}

  createUser(data: ICreateUser): Promise<IUser> {
    return this.userRepository.createAndSave(data);
  }

  async findUserByEmailWithoutError(email: string): Promise<IUser | null> {
    return this.userRepository.findOneByEmail(email);
  }

  async findUserByEmail(email: string): Promise<IUser> {
    const user = await this.userRepository.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('Email não atrelado a nenhum usuário');
    }

    return user;
  }

  async findUserByNickname(nickname: string): Promise<IUser | null> {
    return this.userRepository.findOneByNickname(nickname);
  }

  async findUserByEmailOrNickname(emailOrNickname: string): Promise<IUser> {
    const user =
      await this.userRepository.findOneByEmailOrNickname(emailOrNickname);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }
}
