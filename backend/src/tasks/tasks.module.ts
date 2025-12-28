import { Module } from '@nestjs/common';
import { taskProviders } from './task.provider';
import { TaskResolver } from './task.resolver';
import { TaskService } from './task.service';
import { CreateTaskUseCase } from './use-cases/create-task.usecase';
import { DeleteTaskUseCase } from './use-cases/delete-task.usecase';
import { FindTaskUseCase } from './use-cases/find-task.usecase';
import { UpdateTaskUseCase } from './use-cases/update-task.usecase';
import { UsersModule } from 'src/users/users.module';
import { TaskStreaksModule } from 'src/task-streaks/task-streaks.module';
import { MyTasksUseCase } from './use-cases/my-taks.usecase';

@Module({
  imports: [UsersModule, TaskStreaksModule],
  providers: [
    TaskResolver,
    TaskService,
    ...taskProviders,
    CreateTaskUseCase,
    FindTaskUseCase,
    UpdateTaskUseCase,
    MyTasksUseCase,
    DeleteTaskUseCase,
  ],
  exports: [TaskService],
})
export class TasksModule {}
