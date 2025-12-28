import { BasicInterface } from 'src/common/basic.interface';
import { TaskCategory } from '../enums/task-category.enum';
import { Weekday } from '../enums/weekday.enum';

export interface ITask extends BasicInterface {
  name: string;
  description?: string;
  category: TaskCategory;
  weeklyFrequency: Weekday[];
  userId: string;
  currentStreakId?: string;
}
