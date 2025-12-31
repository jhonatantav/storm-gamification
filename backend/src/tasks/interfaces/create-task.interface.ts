import { TaskCategory } from '../enums/task-category.enum';
import { Weekday } from '../enums/weekday.enum';

export interface ICreateTask {
  name: string;
  description?: string;
  category: TaskCategory;
  weeklyFrequency: Array<Weekday>;
  userId: string;
}
