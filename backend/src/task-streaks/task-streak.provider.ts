import { DataSource, Repository } from 'typeorm';

import { DATABASE_CONNECTION_TOKEN } from 'src/database/database.providers';
import { TaskStreakRepository } from './repositories/task-streak.repository';
import { TaskStreakEntity } from './task-streak.entity';

export const TASKS_STREAK_PROVIDER_TOKEN = 'TASKS_STREAK_PROVIDER_TOKEN';
export const TASKS_STREAK_REPOSITORY_TOKEN = 'TASKS_STREAK_REPOSITORY_TOKEN';

export const tasksStreakProviders = [
  {
    provide: TASKS_STREAK_PROVIDER_TOKEN,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(TaskStreakEntity),
    inject: [DATABASE_CONNECTION_TOKEN],
  },
  {
    provide: TASKS_STREAK_REPOSITORY_TOKEN,
    useFactory: (repository: Repository<TaskStreakEntity>) =>
      new TaskStreakRepository(TaskStreakEntity, repository.manager),
    inject: [TASKS_STREAK_PROVIDER_TOKEN],
  },
];
