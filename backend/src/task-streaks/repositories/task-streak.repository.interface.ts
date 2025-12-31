import { TaskStreakEntity } from '../task-streak.entity';

export interface ITaskStreakRepository {
  findAll(): Promise<TaskStreakEntity[]>;
  findById(id: string): Promise<TaskStreakEntity | null>;
  findByTaskId(taskId: string): Promise<TaskStreakEntity[]>;
  findByUserId(userId: string): Promise<TaskStreakEntity[]>;
  findActiveByTaskId(taskId: string): Promise<TaskStreakEntity | null>;
  createAndSave(data: Partial<TaskStreakEntity>): Promise<TaskStreakEntity>;
  deleteById(id: string): Promise<void>;
}
