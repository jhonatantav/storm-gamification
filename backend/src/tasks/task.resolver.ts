import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserType } from '../auth/decorators/current-user.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { TaskEntity } from './tasks.entity';
import { CreateTaskUseCase } from './use-cases/create-task.usecase';
import { FindTaskUseCase } from './use-cases/find-task.usecase';
import { UpdateTaskUseCase } from './use-cases/update-task.usecase';
import { DeleteTaskUseCase } from './use-cases/delete-task.usecase';
import { ITask } from './interfaces/task.interface';
import { MyTasksUseCase } from './use-cases/my-taks.usecase';

@Resolver(() => TaskEntity)
@UseGuards(GqlAuthGuard)
export class TaskResolver {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly findTaskUseCase: FindTaskUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
    private readonly myTasksUseCase: MyTasksUseCase,
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

  @Query(() => TaskEntity)
  async task(@Args('id') id: string): Promise<ITask> {
    return this.findTaskUseCase.execute(id);
  }

  @Query(() => [TaskEntity])
  async myTasks(@CurrentUser() user: CurrentUserType): Promise<ITask[]> {
    return this.myTasksUseCase.execute(user.id);
  }

  @Mutation(() => TaskEntity)
  async updateTask(
    @Args('id') id: string,
    @Args('input') updateTaskDto: UpdateTaskDto,
  ): Promise<ITask> {
    return this.updateTaskUseCase.execute(id, updateTaskDto);
  }

  @Mutation(() => Boolean)
  async deleteTask(@Args('id') id: string): Promise<boolean> {
    return this.deleteTaskUseCase.execute(id);
  }
}
