import { Injectable } from '@nestjs/common';
import { ITask } from '../interfaces/task.interface';
import { TaskService } from '../task.service';

@Injectable()
export class MyTasksUseCase {
  constructor(private readonly taskService: TaskService) {}

  async execute(userId: string): Promise<ITask[]> {
    const tasks = await this.taskService.findByUserId(userId);
    return tasks;
  }
}
