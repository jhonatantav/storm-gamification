import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserType } from '../auth/decorators/current-user.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CreateTaskDto } from './dtos/create-task.dto';
import { CompleteTaskResponseDto } from './dtos/complete-task-response.dto';
import { DailyTaskPayload } from './dtos/daily-task-payload';
import { TaskEntity } from './tasks.entity';
import { CreateTaskUseCase } from './use-cases/create-task.usecase';
import { CompleteTaskUseCase } from './use-cases/complete-task.usecase';
import { TaskOwnershipGuard } from './guards/task-ownership.guard';

import { ITask } from './interfaces/task.interface';
import { MyTasksUseCase } from './use-cases/my-taks.usecase';
import { DeleteTaskUseCase } from './use-cases/delete-task.usecase';
import { DailyTasksUseCase } from './use-cases/daily-tasks.usecase';

@Resolver(() => TaskEntity)
@UseGuards(GqlAuthGuard)
export class TaskResolver {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly myTasksUseCase: MyTasksUseCase,
    private readonly completeTaskUseCase: CompleteTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
    private readonly dailyTasksUseCase: DailyTasksUseCase,
  ) {}

  @Query(() => [TaskEntity])
  async myTasks(@CurrentUser() user: CurrentUserType): Promise<ITask[]> {
    return this.myTasksUseCase.execute(user.id);
  }

  @Query(() => [DailyTaskPayload])
  async dailyTasks(
    @CurrentUser() user: CurrentUserType,
    @Args('date', { type: () => Date, nullable: true }) date?: Date,
  ): Promise<DailyTaskPayload[]> {
    const referenceDate = date || new Date();
    return this.dailyTasksUseCase.execute({
      userId: user.id,
      date: referenceDate,
    });
  }

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

  @Mutation(() => CompleteTaskResponseDto)
  @UseGuards(TaskOwnershipGuard)
  async completeTask(
    @Args('taskId') taskId: string,
  ): Promise<CompleteTaskResponseDto> {
    return this.completeTaskUseCase.execute(taskId);
  }

  @Mutation(() => Boolean)
  @UseGuards(TaskOwnershipGuard)
  async deleteTask(@Args('taskId') taskId: string): Promise<boolean> {
    await this.deleteTaskUseCase.execute(taskId);
    return true;
  }
}
