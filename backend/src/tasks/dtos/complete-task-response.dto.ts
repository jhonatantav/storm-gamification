import { Field, ObjectType } from '@nestjs/graphql';
import { TaskEntity } from '../tasks.entity';
import { TaskStreakEntity } from '../../task-streaks/task-streak.entity';

@ObjectType()
export class CompleteTaskResponseDto {
  @Field(() => TaskEntity)
  task: TaskEntity;

  @Field(() => TaskStreakEntity)
  streak: TaskStreakEntity;

  @Field()
  message: string;
}
