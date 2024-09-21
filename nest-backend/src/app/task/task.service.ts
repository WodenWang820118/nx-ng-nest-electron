import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Log } from '../logging-interceptor/logging-interceptor.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task)
    private taskRepository: typeof Task
  ) {}

  @Log('Create Task')
  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.taskRepository.create(createTaskDto as any);
  }

  @Log('Find All Tasks')
  async findAll() {
    return await this.taskRepository.findAll();
  }

  async findOne(id: string) {
    return await this.taskRepository.findOne({ where: { id: id } });
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    return await this.taskRepository.update(
      {
        text: updateTaskDto.text,
        day: updateTaskDto.day,
        reminder: updateTaskDto.reminder,
      },
      { where: { id: id } }
    );
  }

  @Log('Remove Task')
  async remove(id: string) {
    return await this.taskRepository.destroy({ where: { id: id } });
  }

  @Log('Remove Task By Name')
  async removeByName(name: string) {
    return await this.taskRepository.destroy({
      where: { title: name },
    });
  }
}
