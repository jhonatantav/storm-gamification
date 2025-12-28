import { Injectable, NotFoundException } from '@nestjs/common';

import { TaskEntity } from '../tasks.entity';
import { TaskService } from '../task.service';

@Injectable()
export class UpdateTaskUseCase {
  constructor(private readonly taskService: TaskService) {}

  async execute(id: string, data: Partial<TaskEntity>): Promise<TaskEntity> {
    const task = await this.taskService.findById(id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return this.taskService.update(id, data);
  }
}
