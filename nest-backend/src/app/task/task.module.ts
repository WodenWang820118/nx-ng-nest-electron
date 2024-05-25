import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from './entities/task.entity';
import { TaskController } from './task.controller';

@Module({
  imports: [SequelizeModule.forFeature([Task])],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [SequelizeModule.forFeature([Task]), TaskService],
})
export class TaskModule {}
