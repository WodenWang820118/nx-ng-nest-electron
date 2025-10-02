import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { dataBaseConfig } from '../app/database/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggingInterceptorModule } from './logging-interceptor/logging-interceptor.module';
import { LoggingInterceptor } from './logging-interceptor/logging-interceptor.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(dataBaseConfig),
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
