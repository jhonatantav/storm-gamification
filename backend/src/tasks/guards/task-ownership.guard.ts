import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { TaskService } from '../task.service';
import type { CurrentUserType } from '../../auth/decorators/current-user.decorator';

@Injectable()
export class TaskOwnershipGuard implements CanActivate {
  constructor(private readonly taskService: TaskService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const gqlContext = ctx.getContext<{ req: { user: CurrentUserType } }>();
    const args = ctx.getArgs();

    const user = gqlContext.req.user;

    // Procura por taskId nos argumentos (pode estar em 'id', 'taskId', ou dentro de 'input')
    const taskId = args.taskId || args.input?.id || args.input?.taskId;

    if (!taskId) {
      // Se não houver taskId, não permite o acesso
      return false;
    }

    // Busca a task
    const task = await this.taskService.findById(taskId);

    if (!task) {
      throw new NotFoundException(`Tarefa com ID ${taskId} não encontrada`);
    }

    // Verifica se a task pertence ao usuário
    if (task.userId !== user.id) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar esta tarefa',
      );
    }

    return true;
  }
}
