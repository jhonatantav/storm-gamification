import { DataSource } from 'typeorm';
import { env } from '../environment';
import { SnakeNamingStrategy } from './naming-strategy';

export const DATABASE_CONNECTION_TOKEN = 'DATABASE_CONNECTION_TOKEN';

export const AppDataSource = new DataSource({
  type: 'postgres',
  entities: [`${__dirname}/../**/*.entity{.ts,.js}`],

  host: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
  database: env.POSTGRES_DB,
  username: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  ssl: env.DATABASE_SSL === 'true',
  connectTimeoutMS: env.DATABASE_CONNECTION_TIMEOUT,
  logNotifications: true,
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
  namingStrategy: new SnakeNamingStrategy(),
});

export const databaseProviders = [
  {
    provide: DATABASE_CONNECTION_TOKEN,
    useFactory: () => {
      return AppDataSource.initialize();
    },
  },
];
