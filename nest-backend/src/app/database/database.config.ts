import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { join } from 'path';
import { cwd } from 'process';
import { SequelizeOptions } from 'sequelize-typescript';

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

function getDatabaseConfig(): Partial<
  {
    name?: string;
    retryAttempts?: number;
    retryDelay?: number;
    autoLoadModels?: boolean;
    synchronize?: boolean;
    uri?: string;
  } & Partial<SequelizeOptions>
> {
  return {
    dialect: 'sqlite',
    storage: getDatabasePath(),
    autoLoadModels: true,
    synchronize: true,
  };
}

export const dataBaseConfig: SequelizeModuleOptions = getDatabaseConfig();
