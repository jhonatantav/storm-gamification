import { Injectable } from '@nestjs/common';
import { TaskService } from '../task.service';
import { ITask } from '../interfaces/task.interface';
import { TaskStreakService } from 'src/task-streaks/task-streak.service';
import { DailyTaskPayload } from '../dtos/daily-task-payload';

@Injectable()
export class DailyTasksUseCase {
  constructor(
    private readonly taskService: TaskService,
    private readonly taskStreakService: TaskStreakService,
  ) {}

  async execute({
    userId,
    date,
  }: {
    userId: string;
    date: Date;
  }): Promise<DailyTaskPayload[]> {
    const daily = date.getDay();

    const userTasks = await this.taskService.findDailyTasks({
      userId,
      weekDay: daily,
    });

    return this.transformeToSimpleTask(userTasks, date);
  }

  private async transformeToSimpleTask(
    data: ITask[],
    date: Date,
  ): Promise<DailyTaskPayload[]> {
    const tasksWithStreaks = await Promise.all(
      data.map(async (task) => {
        const streak = await this.taskStreakService.findActiveByTaskId(task.id);
        const taskIsCompleted = this.isCompletedToday(
          date,
          streak?.lastCompletedAt,
        );

        return {
          id: task.id,
          name: task.name,
          description: task?.description,
          taskIsCompleted,
          currentStreak: streak?.currentStreak || 0,
        };
      }),
    );

    return tasksWithStreaks;
  }

  private isCompletedToday(
    referenceDate: Date,
    lastCompletedAt?: Date,
  ): boolean {
    if (!lastCompletedAt) {
      return false;
    }

    const completedDate = new Date(lastCompletedAt);
    const today = new Date(referenceDate);

    return (
      completedDate.getFullYear() === today.getFullYear() &&
      completedDate.getMonth() === today.getMonth() &&
      completedDate.getDate() === today.getDate()
    );
  }
}
