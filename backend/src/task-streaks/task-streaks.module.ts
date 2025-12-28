import { Module } from '@nestjs/common';
import { TaskStreakService } from './task-streak.service';
import { tasksStreakProviders } from './task-streak.provider';
import { UsersModule } from 'src/users/users.module';
import { TasksModule } from 'src/tasks/tasks.module';

@Module({
  imports: [UsersModule, TasksModule],
  providers: [TaskStreakService, ...tasksStreakProviders],
  exports: [TaskStreakService],
})
export class TaskStreaksModule {}
