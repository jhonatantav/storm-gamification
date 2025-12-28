import { Injectable } from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { TaskEntity } from '../tasks.entity';
import { ITaskRepository } from './task.repository.interface';
import { ITask } from '../interfaces/task.interface';

@Injectable()
export class TaskRepository
  extends Repository<TaskEntity>
  implements ITaskRepository
{
  async findAll(): Promise<TaskEntity[]> {
    return this.find({
      relations: ['user', 'currentStreak'],
    });
  }

  async findById(id: string): Promise<TaskEntity | null> {
    return this.findOne({
      where: { id },
      relations: ['user', 'currentStreak'],
    });
  }

  async findByUserId(userId: string): Promise<TaskEntity[]> {
    return this.find({
      where: { userId },
      relations: ['currentStreak'],
    });
  }

  createAndSave(data: DeepPartial<ITask>) {
    const task = this.create(data);
    return this.save(task);
  }

  async deleteById(id: string): Promise<void> {
    await this.softDelete(id);
  }
}
