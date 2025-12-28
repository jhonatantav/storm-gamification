import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { TaskEntity } from '../tasks/tasks.entity';
import { BaseAbstractWithoutSoftDeleteEntity } from '../database/entities/base-without-soft-delete.entity';
import { UserEntity } from '../users/users.entity';

@ObjectType()
@Entity('task_streaks')
export class TaskStreakEntity extends BaseAbstractWithoutSoftDeleteEntity {
  @Field()
  @Column({ type: 'uuid' })
  taskId: string;

  @Field(() => TaskEntity)
  @ManyToOne(() => TaskEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'taskId' })
  task: TaskEntity;

  @Field()
  @Column({ type: 'uuid' })
  userId: string;

  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  currentStreak: number;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  longestStreak: number;

  @Field({ nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  lastCompletedAt?: Date;

  @Field()
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Field({ nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  endedAt?: Date;
}
