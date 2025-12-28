import { Injectable } from '@nestjs/common';

import { TaskService } from '../task.service';
import { ITask } from '../interfaces/task.interface';

@Injectable()
export class FindTaskUseCase {
  constructor(private readonly taskService: TaskService) {}

  async execute(taskId: string): Promise<ITask> {
    const task = await this.taskService.findById(taskId);
    return task;
  }
}
