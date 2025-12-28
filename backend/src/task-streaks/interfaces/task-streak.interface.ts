import { BasicInterface } from 'src/common/basic.interface';

export interface ITaskStreak extends BasicInterface {
  taskId: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastCompletedAt?: Date;
  isActive: boolean;
  endedAt?: Date;
}
