import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { dataBaseConfig } from '../app/database/database.config';
import { SequelizeModule } from '@nestjs/sequelize';
import { TaskModule } from './task/task.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRoot(dataBaseConfig),
    TaskModule,
  ],
})
export class AppModule {}
