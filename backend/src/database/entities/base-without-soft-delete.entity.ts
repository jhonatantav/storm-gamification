import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType({ isAbstract: true })
export abstract class BaseAbstractWithoutSoftDeleteEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Int)
  @Column({
    generated: 'increment',
  })
  seqId: number;

  @Field()
  @Column({
    type: 'boolean',
    default: true,
  })
  status: boolean;

  @Field()
  @CreateDateColumn({ type: 'timestamp', update: false })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
