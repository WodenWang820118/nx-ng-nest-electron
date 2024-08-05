import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { TaskService } from './task.service';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

describe('TaskService', () => {
  let service: TaskService;
  let mockTaskRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskService],
    })
      .useMocker((token) => {
        if (token === getModelToken(Task)) {
          return {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            destroy: jest.fn(),
          };
        }
      })
      .compile();
    service = module.get<TaskService>(TaskService);
    mockTaskRepository = module.get(getModelToken(Task));
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should create a task', async () => {
    const createTaskDto: CreateTaskDto = {
      id: '1',
      text: 'Test task',
      day: '2023-07-31',
      reminder: true,
    };
    const expectedResult = { id: '1', ...createTaskDto };
    mockTaskRepository.create.mockResolvedValue(expectedResult);
    const result = await service.create(createTaskDto);
    expect(mockTaskRepository.create).toHaveBeenCalledWith(createTaskDto);
    expect(result).toEqual(expectedResult);
  });
  it('should return an array of tasks', async () => {
    const expectedResult = [
      { id: '1', text: 'Task 1', day: '2023-07-31', reminder: true },
      { id: '2', text: 'Task 2', day: '2023-08-01', reminder: false },
    ];
    mockTaskRepository.findAll.mockResolvedValue(expectedResult);
    const result = await service.findAll();
    expect(mockTaskRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(expectedResult);
  });
  it('should return a task by id', async () => {
    const id = '1';
    const expectedResult = {
      id,
      text: 'Task 1',
      day: '2023-07-31',
      reminder: true,
    };
    mockTaskRepository.findOne.mockResolvedValue(expectedResult);
    const result = await service.findOne(id);
    expect(mockTaskRepository.findOne).toHaveBeenCalledWith({ where: { id } });
    expect(result).toEqual(expectedResult);
  });
  it('should update a task', async () => {
    const id = '1';
    const updateTaskDto: UpdateTaskDto = {
      text: 'Updated task',
      day: '2023-08-01',
      reminder: false,
    };
    const expectedResult = [1]; // Sequelize update returns affected rows count
    mockTaskRepository.update.mockResolvedValue(expectedResult);
    const result = await service.update(id, updateTaskDto);
    expect(mockTaskRepository.update).toHaveBeenCalledWith(
      {
        text: updateTaskDto.text,
        day: updateTaskDto.day,
        reminder: updateTaskDto.reminder,
      },
      { where: { id } }
    );
    expect(result).toEqual(expectedResult);
  });
  it('should remove a task by id', async () => {
    const id = '1';
    const expectedResult = 1; // Sequelize destroy returns affected rows count
    mockTaskRepository.destroy.mockResolvedValue(expectedResult);
    const result = await service.remove(id);
    expect(mockTaskRepository.destroy).toHaveBeenCalledWith({ where: { id } });
    expect(result).toEqual(expectedResult);
  });
  it('should remove a task by name', async () => {
    const name = 'Test task';
    const expectedResult = 1; // Sequelize destroy returns affected rows count
    mockTaskRepository.destroy.mockResolvedValue(expectedResult);
    const result = await service.removeByName(name);
    expect(mockTaskRepository.destroy).toHaveBeenCalledWith({
      where: { title: name },
    });
    expect(result).toEqual(expectedResult);
  });
});
