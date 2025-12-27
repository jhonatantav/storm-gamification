import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType({ isAbstract: true })
export abstract class BaseAbstractEntity {
  @Field(() => ID)
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
  @CreateDateColumn({ type: 'timestamp', update: false, select: true })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp', select: true })
  updatedAt: Date;

  @Field({ nullable: true })
  @DeleteDateColumn({ type: 'timestamp', select: true })
  deletedAt?: Date;
}
