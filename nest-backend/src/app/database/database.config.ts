import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { cwd } from 'process';
import { Task } from '../task/entities/task.entity';

const DATABASE_NAME = 'database.sqlite3';

function getDatabasePath() {
  const defaultDatabasePath = join(cwd(), DATABASE_NAME);
  switch (process.env.NODE_ENV) {
    case 'dev':
    case 'staging':
      return defaultDatabasePath;
    case 'prod':
    default:
      if (process.env.DATABASE_PATH) {
        return process.env.DATABASE_PATH;
      }
      return defaultDatabasePath;
  }
}

function getDatabaseConfig(): TypeOrmModuleOptions {
  return {
    type: 'sqlite',
    database: getDatabasePath(),
    entities: [Task],
    synchronize: true, // Set to false in production
    logging: process.env.NODE_ENV === 'dev',
  };
}

export const dataBaseConfig: TypeOrmModuleOptions = getDatabaseConfig();
