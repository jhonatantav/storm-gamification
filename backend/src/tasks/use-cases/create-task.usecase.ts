import { Injectable } from '@nestjs/common';
import { ICreateTask } from '../interfaces/create-task.interface';

import { TaskEntity } from '../tasks.entity';
import { TaskService } from '../task.service';

@Injectable()
export class CreateTaskUseCase {
  constructor(private readonly taskService: TaskService) {}

  async execute(data: ICreateTask): Promise<TaskEntity> {
    return this.taskService.createTask(data);
  }
}
