import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { TaskEntity } from './tasks.entity';
import { TASKS_REPOSITORY_TOKEN } from './task.provider';
import type { ITaskRepository } from './repositories/task.repository.interface';
import { UserService } from 'src/users/user.service';

@Injectable()
export class TaskService {
  constructor(
    @Inject(TASKS_REPOSITORY_TOKEN)
    private readonly taskRepository: ITaskRepository,
    private readonly userService: UserService,
  ) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    const createdTask = await this.taskRepository.createAndSave(createTaskDto);
    if (!createdTask) {
      throw new InternalServerErrorException('Falha ao criar a tarefa');
    }

    return createdTask;
  }

  async findAll(): Promise<TaskEntity[]> {
    return this.taskRepository.findAll();
  }

  async findById(id: string): Promise<TaskEntity> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new NotFoundException(`Tarefa com ID ${id} não encontrada`);
    }

    return task;
  }

  async findByUserId(userId: string): Promise<TaskEntity[]> {
    return this.taskRepository.findByUserId(userId);
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<TaskEntity> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new NotFoundException(`Tarefa com ID ${id} não encontrada`);
    }

    const updatedTask = await this.taskRepository.createAndSave({
      ...task,
      ...updateTaskDto,
    });

    return updatedTask;
  }

  async delete(id: string): Promise<void> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new NotFoundException(`Tarefa com ID ${id} não encontrada`);
    }

    await this.taskRepository.deleteById(id);
  }

  async findDailyTasks(data: { weekDay: number; userId: string }) {
    const foundTasks = await this.taskRepository.findDailyUserTasks(
      data.weekDay,
      data.userId,
    );

    if (!foundTasks) return [];

    return foundTasks;
  }
}
