import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { join } from 'path';
import { cwd } from 'process';
import { SequelizeOptions } from 'sequelize-typescript';

const DATABASE_NAME = 'database.sqlite3';

function getDatabasePath() {
  let databasePath: string;
  switch (process.env.NODE_ENV) {
    case 'dev':
    case 'staging':
      databasePath = join(cwd(), DATABASE_NAME);
      break;
    case 'prod':
    default:
      databasePath = join(process.env.DATABASE_PATH);
      break;
  }
  return databasePath;
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
