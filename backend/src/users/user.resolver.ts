import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserUseCase } from './use-cases/create-user.usecase';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserEntity } from './users.entity';
import { FindUserUseCase } from './use-cases/find-user.usecase';

@Resolver(() => UserEntity)
export class UserResolver {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findUserUseCase: FindUserUseCase,
  ) {}

  @Mutation(() => UserEntity)
  async createUser(@Args('input') input: CreateUserDto): Promise<UserEntity> {
    return this.createUserUseCase.execute(input) as Promise<UserEntity>;
  }

  @Query(() => UserEntity, { nullable: true })
  async findUser(@Args('email') email: string): Promise<UserEntity | null> {
    return this.findUserUseCase.execute(email) as Promise<UserEntity | null>;
  }
}
