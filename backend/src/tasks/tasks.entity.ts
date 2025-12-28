import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { TaskCategory } from './enums/task-category.enum';
import { Weekday } from './enums/weekday.enum';
import { BaseAbstractEntity } from 'src/database/entities/base.entity';
import { TaskStreakEntity } from '../task-streaks/task-streak.entity';
import { UserEntity } from 'src/users/users.entity';

@ObjectType()
@Entity('tasks')
export class TaskEntity extends BaseAbstractEntity {
  @Field()
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @Field(() => TaskCategory)
  @Column({
    type: 'enum',
    enum: TaskCategory,
    default: TaskCategory.OTHER,
  })
  category: TaskCategory;

  @Field(() => [Weekday])
  @Column('simple-array')
  weeklyFrequency: Weekday[];

  @Field()
  @Column({ type: 'uuid' })
  userId: string;

  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Field({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  currentStreakId?: string;

  @Field(() => TaskStreakEntity, { nullable: true })
  @OneToOne(() => TaskStreakEntity, (streak) => streak.task, { nullable: true })
  @JoinColumn({ name: 'currentStreakId' })
  currentStreak?: TaskStreakEntity;
}
