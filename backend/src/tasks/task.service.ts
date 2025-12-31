import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { TaskEntity } from './tasks.entity';
import { TASKS_REPOSITORY_TOKEN } from './task.provider';
import type { ITaskRepository } from './repositories/task.repository.interface';
import { Weekday } from './enums/weekday.enum';
import { UserService } from 'src/users/user.service';
import { Logger } from 'nestjs-pino';

@Injectable()
export class TaskService {
  private readonly BASE_XP = 5;

  constructor(
    @Inject(TASKS_REPOSITORY_TOKEN)
    private readonly taskRepository: ITaskRepository,
    private readonly userService: UserService,
    private readonly logger: Logger,
  ) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    const createdTask = await this.taskRepository.createAndSave(createTaskDto);
    if (!createdTask) {
      throw new InternalServerErrorException('Falha ao criar a tarefa');
    }

    return createdTask;
  }

  async findAll(): Promise<TaskEntity[]> {
    return this.taskRepository.findAll();
  }

  async findById(id: string): Promise<TaskEntity> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new NotFoundException(`Tarefa com ID ${id} não encontrada`);
    }

    return task;
  }

  async findByUserId(userId: string): Promise<TaskEntity[]> {
    return this.taskRepository.findByUserId(userId);
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<TaskEntity> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new NotFoundException(`Tarefa com ID ${id} não encontrada`);
    }

    const updatedTask = await this.taskRepository.createAndSave({
      ...task,
      ...updateTaskDto,
    });

    return updatedTask;
  }

  async delete(id: string): Promise<void> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new NotFoundException(`Tarefa com ID ${id} não encontrada`);
    }

    await this.taskRepository.deleteById(id);
  }

  /**
   * Calcula o XP de uma task baseado na frequência semanal e streak atual.
   * O multiplicador aumenta gradualmente conforme a streak progride.
   *
   * Lógica:
   * 1. Calcula quantas "semanas completas" de streak o usuário tem
   * 2. O multiplicador máximo só é alcançado após completar pelo menos uma semana
   * 3. O XP cresce gradualmente até atingir o multiplicador máximo
   *
   * Fórmula: BASE_XP * frequência * multiplicador_streak
   *
   * Multiplicadores por semana de streak:
   * - Dias 1-6: Crescimento gradual (1.0x até frequência/frequência)
   * - Dia 7+: Multiplicador máximo baseado na frequência
   *
   * Multiplicadores máximos por frequência:
   * - 1 dia/semana: 1.0x → MAX: 2.0x
   * - 2 dias/semana: 1.0x → MAX: 2.2x
   * - 3 dias/semana: 1.0x → MAX: 2.5x
   * - 4 dias/semana: 1.0x → MAX: 3.0x
   * - 5 dias/semana: 1.0x → MAX: 3.5x
   * - 6 dias/semana: 1.0x → MAX: 4.0x
   * - 7 dias/semana: 1.0x → MAX: 5.0x
   *
   * @param task - A tarefa para calcular o XP
   * @param currentStreak - A streak atual da task (quantos dias seguidos)
   * @returns O valor de XP que a task concede
   */
  calculateTaskXp(task: TaskEntity, currentStreak: number = 1): number {
    const frequency = task.weeklyFrequency.length;

    // Multiplicadores máximos por frequência
    const maxMultiplierMap: Record<number, number> = {
      1: 2.0,
      2: 2.2,
      3: 2.5,
      4: 3.0,
      5: 3.5,
      6: 4.0,
      7: 5.0,
    };

    const maxMultiplier = maxMultiplierMap[frequency] || 2.0;

    // Calcula o multiplicador baseado na streak
    // Começa em 1.0x e cresce gradualmente até atingir o máximo
    let streakMultiplier: number;

    if (currentStreak < frequency) {
      // Crescimento gradual: 1.0 + (progresso * (max - 1.0))
      const progress = currentStreak / frequency;
      streakMultiplier = 1.0 + progress * (maxMultiplier - 1.0);
    } else {
      // Após completar pelo menos uma semana, usa o multiplicador máximo
      streakMultiplier = maxMultiplier;
    }

    // XP = BASE_XP * frequência * multiplicador_streak
    const xp = this.BASE_XP * frequency * streakMultiplier;

    return Math.floor(xp);
  }

  /**
   * Completa uma task e concede XP ao usuário.
   * Este método deve ser chamado quando o usuário conclui uma task e mantém a streak.
   *
   * @param taskId - ID da task completada
   * @param userId - ID do usuário que completou a task
   * @param currentStreak - A streak atual da task (quantos dias seguidos)
   * @returns O usuário atualizado com o novo XP
   */
  async completeTaskAndGrantXp(
    taskId: string,
    userId: string,
    currentStreak: number = 1,
  ) {
    const task = await this.findById(taskId);

    if (task.userId !== userId) {
      throw new NotFoundException(
        'Esta task não pertence ao usuário informado',
      );
    }

    const xpEarned = this.calculateTaskXp(task, currentStreak);

    this.logger.log(
      `Usuário ${userId} completou a task "${task.name}" (streak: ${currentStreak}) e ganhou ${xpEarned} XP`,
    );

    const updatedUser = await this.userService.addXpToUser(userId, xpEarned);

    return {
      task,
      xpEarned,
      currentStreak,
      user: updatedUser,
    };
  }
}
