import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { dataBaseConfig } from '../app/database/database.config';
import { SequelizeModule } from '@nestjs/sequelize';
import { TaskModule } from './task/task.module';
import { HealthModule } from './health/health.module';
import { LoggingInterceptorModule } from './logging-interceptor/logging-interceptor.module';
import { LoggingInterceptor } from './logging-interceptor/logging-interceptor.service';

@Module({
  imports: [
    HealthModule,
    ConfigModule.forRoot(),
    SequelizeModule.forRoot(dataBaseConfig),
    TaskModule,
    LoggingInterceptorModule,
  ],
  providers: [
    {
      provide: 'APP_INTERCEPTOR',
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
