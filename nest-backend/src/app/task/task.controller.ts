import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get('')
  async getTasks() {
    return await this.taskService.findAll();
  }

  @Get(':id')
  async getTask(id: string) {
    return await this.taskService.findOne(id);
  }

  @Post('/create')
  async createTask(@Body() task: CreateTaskDto) {
    return await this.taskService.create(task);
  }

  @Put(':id')
  async updateTask(@Body() task: CreateTaskDto) {
    return await this.taskService.update(task.id, task);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string) {
    return await this.taskService.remove(id);
  }
}
