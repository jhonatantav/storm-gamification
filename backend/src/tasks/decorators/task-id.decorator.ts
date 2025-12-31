import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const TaskId = createParamDecorator(
  (data: unknown, context: ExecutionContext): string => {
    const ctx = GqlExecutionContext.create(context);
    const args = ctx.getArgs();

    // Procura por taskId nos argumentos
    return args.id || args.taskId || args.input?.id || args.input?.taskId;
  },
);
