import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserUseCase } from './use-cases/create-user.usecase';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserEntity } from './users.entity';
import { FindUserUseCase } from './use-cases/find-user.usecase';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserType } from '../auth/decorators/current-user.decorator';

@Resolver(() => UserEntity)
export class UserResolver {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findUserUseCase: FindUserUseCase,
  ) {}

  @Public()
  @Mutation(() => UserEntity)
  async createUser(@Args('input') input: CreateUserDto): Promise<UserEntity> {
    return this.createUserUseCase.execute(input) as Promise<UserEntity>;
  }

  @Query(() => UserEntity, { nullable: true })
  async findUser(@Args('email') email: string): Promise<UserEntity | null> {
    return this.findUserUseCase.execute(email) as Promise<UserEntity | null>;
  }

  // Nova query - Retorna o perfil do usuário autenticado
  @Query(() => UserEntity, { name: 'me' })
  async getCurrentUser(
    @CurrentUser() user: CurrentUserType,
  ): Promise<UserEntity | null> {
    return this.findUserUseCase.execute(
      user.email,
    ) as Promise<UserEntity | null>;
  }
}
