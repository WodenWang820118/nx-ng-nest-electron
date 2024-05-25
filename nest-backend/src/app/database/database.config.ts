import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { join } from 'path';
import { cwd } from 'process';
import { SequelizeOptions } from 'sequelize-typescript';

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
    storage: join(cwd(), 'database.sqlite'),
    autoLoadModels: true,
    synchronize: true,
  };
}

export const dataBaseConfig: SequelizeModuleOptions = getDatabaseConfig();
