import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TaskStreakEntity } from '../task-streak.entity';
import type { ITaskStreakRepository } from './task-streak.repository.interface';
import { ITaskStreak } from '../interfaces/task-streak.interface';

@Injectable()
export class TaskStreakRepository
  extends Repository<TaskStreakEntity>
  implements ITaskStreakRepository
{
  async findAll(): Promise<TaskStreakEntity[]> {
    return this.find({
      relations: ['task', 'user'],
    });
  }

  async findById(id: string): Promise<TaskStreakEntity | null> {
    return this.findOne({
      where: { id },
      relations: ['task', 'user'],
    });
  }

  async findByTaskId(taskId: string): Promise<TaskStreakEntity[]> {
    return this.find({
      where: { taskId },
      relations: ['task', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUserId(userId: string): Promise<TaskStreakEntity[]> {
    return this.find({
      where: { userId },
      relations: ['task'],
      order: { createdAt: 'DESC' },
    });
  }

  async findActiveByTaskId(taskId: string): Promise<TaskStreakEntity | null> {
    return this.findOne({
      where: { taskId, isActive: true },
      relations: ['task', 'user'],
    });
  }

  async createAndSave(data: Partial<ITaskStreak>): Promise<TaskStreakEntity> {
    const taskStreak = this.create(data);
    return this.save(taskStreak);
  }

  async deleteById(id: string): Promise<void> {
    await this.delete(id);
  }
}
