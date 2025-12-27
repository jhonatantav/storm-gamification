import { DataSource, Repository } from 'typeorm';

import { UserRepository } from './repositories/user.repository';

import { DATABASE_CONNECTION_TOKEN } from 'src/database/database.providers';
import { UserEntity } from './users.entity';

export const USERS_PROVIDER_TOKEN = 'USERS_PROVIDER';
export const USERS_REPOSITORY_TOKEN = 'USERS_REPOSITORY';

export const userProviders = [
  {
    provide: USERS_PROVIDER_TOKEN,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserEntity),
    inject: [DATABASE_CONNECTION_TOKEN],
  },
  {
    provide: USERS_REPOSITORY_TOKEN,
    useFactory: (repository: Repository<UserEntity>) =>
      new UserRepository(UserEntity, repository.manager),
    inject: [USERS_PROVIDER_TOKEN],
  },
];
