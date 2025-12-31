import { BadRequestException, Injectable } from '@nestjs/common';
import { ICreateTask } from '../interfaces/create-task.interface';

import { TaskEntity } from '../tasks.entity';
import { TaskService } from '../task.service';

@Injectable()
export class CreateTaskUseCase {
  constructor(private readonly taskService: TaskService) {}

  async execute(data: ICreateTask): Promise<TaskEntity> {
    const allMemberTasks = await this.taskService.findByUserId(data.userId);

    if (allMemberTasks.some((task) => task.name === data.name)) {
      throw new BadRequestException('Tarefa com esse nome já existe');
    }

    return this.taskService.createTask(data);
  }
}
