import { TaskEntity } from '../tasks.entity';

export interface ITaskRepository {
  findAll(): Promise<TaskEntity[]>;
  findById(id: string): Promise<TaskEntity | null>;
  findByUserId(userId: string): Promise<TaskEntity[]>;
  createAndSave(data: Partial<TaskEntity>): Promise<TaskEntity>;
  deleteById(id: string): Promise<void>;
  findDailyUserTasks(
    weekDay: number,
    userId: string,
  ): Promise<TaskEntity[] | null>;
}
