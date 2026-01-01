import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DailyTaskPayload {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  taskIsCompleted: boolean;

  @Field(() => Int)
  currentStreak: number;
}
