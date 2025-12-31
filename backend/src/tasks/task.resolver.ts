import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserType } from '../auth/decorators/current-user.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CreateTaskDto } from './dtos/create-task.dto';
import { CompleteTaskResponseDto } from './dtos/complete-task-response.dto';
import { TaskEntity } from './tasks.entity';
import { CreateTaskUseCase } from './use-cases/create-task.usecase';
import { CompleteTaskUseCase } from './use-cases/complete-task.usecase';
import { TaskOwnershipGuard } from './guards/task-ownership.guard';

import { ITask } from './interfaces/task.interface';
import { MyTasksUseCase } from './use-cases/my-taks.usecase';

@Resolver(() => TaskEntity)
@UseGuards(GqlAuthGuard)
export class TaskResolver {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly myTasksUseCase: MyTasksUseCase,
    private readonly completeTaskUseCase: CompleteTaskUseCase,
  ) {}

  @Mutation(() => TaskEntity)
  async createTask(
    @Args('input') createTaskDto: CreateTaskDto,
    @CurrentUser() user: CurrentUserType,
  ): Promise<TaskEntity> {
    return this.createTaskUseCase.execute({
      ...createTaskDto,
      userId: user.id,
    });
  }

  @Query(() => [TaskEntity])
  async myTasks(@CurrentUser() user: CurrentUserType): Promise<ITask[]> {
    return this.myTasksUseCase.execute(user.id);
  }

  @Mutation(() => CompleteTaskResponseDto)
  @UseGuards(TaskOwnershipGuard)
  async completeTask(
    @Args('taskId') taskId: string,
  ): Promise<CompleteTaskResponseDto> {
    return this.completeTaskUseCase.execute(taskId);
  }
}
