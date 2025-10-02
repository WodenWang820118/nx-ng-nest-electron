/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { LazyModuleLoader, NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const lazyModuleLoader = app.get(LazyModuleLoader);
  const { TaskModule } = await import('./app/task/task.module');
  const { HealthModule } = await import('./app/health/health.module');
  await lazyModuleLoader.load(() => HealthModule);
  await lazyModuleLoader.load(() => TaskModule);
  app.enableCors();
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
