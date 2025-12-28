import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import type { ITaskStreakRepository } from './repositories/task-streak.repository.interface';
import { TASKS_STREAK_REPOSITORY_TOKEN } from './task-streak.provider';
import { ITaskStreak } from './interfaces/task-streak.interface';

@Injectable()
export class TaskStreakService {
  constructor(
    @Inject(TASKS_STREAK_REPOSITORY_TOKEN)
    private readonly taskStreakRepository: ITaskStreakRepository,
  ) {}

  async createStreak(data: Partial<ITaskStreak>): Promise<ITaskStreak> {
    const createdStreak = await this.taskStreakRepository.createAndSave(data);

    if (!createdStreak) {
      throw new InternalServerErrorException('Falha ao criar a streak');
    }

    return createdStreak;
  }

  async findAll(): Promise<ITaskStreak[]> {
    return this.taskStreakRepository.findAll();
  }

  async findById(id: string): Promise<ITaskStreak> {
    const streak = await this.taskStreakRepository.findById(id);

    if (!streak) {
      throw new NotFoundException(`Streak com ID ${id} não encontrada`);
    }

    return streak;
  }

  async findByTaskId(taskId: string): Promise<ITaskStreak[]> {
    return this.taskStreakRepository.findByTaskId(taskId);
  }

  async findByUserId(userId: string): Promise<ITaskStreak[]> {
    return this.taskStreakRepository.findByUserId(userId);
  }

  async findActiveByTaskId(taskId: string): Promise<ITaskStreak | null> {
    return this.taskStreakRepository.findActiveByTaskId(taskId);
  }

  async update(id: string, data: Partial<ITaskStreak>): Promise<ITaskStreak> {
    const streak = await this.taskStreakRepository.findById(id);

    if (!streak) {
      throw new NotFoundException(`Streak com ID ${id} não encontrada`);
    }

    const updatedStreak = await this.taskStreakRepository.createAndSave({
      ...streak,
      ...data,
    });

    return updatedStreak;
  }

  async delete(id: string): Promise<void> {
    const streak = await this.taskStreakRepository.findById(id);

    if (!streak) {
      throw new NotFoundException(`Streak com ID ${id} não encontrada`);
    }

    await this.taskStreakRepository.deleteById(id);
  }
}
