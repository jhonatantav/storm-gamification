import { Module } from '@nestjs/common';
import { userProviders } from './user.provider';
import { UserService } from './user.service';
import { CreateUserUseCase } from './use-cases/create-user.usecase';
import { UserResolver } from './user.resolver';
import { FindUserUseCase } from './use-cases/find-user.usecase';

@Module({
  providers: [
    ...userProviders,
    UserResolver,
    UserService,
    CreateUserUseCase,
    FindUserUseCase,
  ],
  exports: [...userProviders, UserService],
})
export class UsersModule {}
