import { Injectable, NotFoundException } from '@nestjs/common';

import { TaskService } from '../task.service';

@Injectable()
export class DeleteTaskUseCase {
  constructor(private readonly taskService: TaskService) {}

  async execute(id: string): Promise<boolean> {
    const task = await this.taskService.findById(id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    await this.taskService.delete(id);
    return true;
  }
}
