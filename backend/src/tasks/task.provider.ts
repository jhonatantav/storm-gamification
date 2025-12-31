import { DataSource, Repository } from 'typeorm';

import { DATABASE_CONNECTION_TOKEN } from 'src/database/database.providers';
import { TaskEntity } from './tasks.entity';
import { TaskRepository } from './repositories/task.repository';

export const TASKS_PROVIDER_TOKEN = 'TASKS_PROVIDER';
export const TASKS_REPOSITORY_TOKEN = 'TASKS_REPOSITORY';

export const taskProviders = [
  {
    provide: TASKS_PROVIDER_TOKEN,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(TaskEntity),
    inject: [DATABASE_CONNECTION_TOKEN],
  },
  {
    provide: TASKS_REPOSITORY_TOKEN,
    useFactory: (repository: Repository<TaskEntity>) =>
      new TaskRepository(TaskEntity, repository.manager),
    inject: [TASKS_PROVIDER_TOKEN],
  },
];
