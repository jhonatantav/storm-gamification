import { Module } from '@nestjs/common';
import { taskProviders } from './task.provider';
import { TaskResolver } from './task.resolver';
import { TaskService } from './task.service';
import { CreateTaskUseCase } from './use-cases/create-task.usecase';
import { CompleteTaskUseCase } from './use-cases/complete-task.usecase';
import { UsersModule } from 'src/users/users.module';
import { TaskStreaksModule } from 'src/task-streaks/task-streaks.module';
import { TemporalModule } from 'src/temporal/temporal.module';
import { MyTasksUseCase } from './use-cases/my-taks.usecase';
import { TaskOwnershipGuard } from './guards/task-ownership.guard';

@Module({
  imports: [UsersModule, TaskStreaksModule, TemporalModule],
  providers: [
    TaskResolver,
    TaskService,
    ...taskProviders,
    CreateTaskUseCase,
    CompleteTaskUseCase,
    MyTasksUseCase,
    TaskOwnershipGuard,
  ],
  exports: [TaskService],
})
export class TasksModule {}
