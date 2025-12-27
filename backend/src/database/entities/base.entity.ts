import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseAbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    generated: 'increment',
  })
  seqId: number;

  @Column({
    type: 'boolean',
    default: true,
  })
  status: boolean;

  @CreateDateColumn({ type: 'timestamp', update: false, select: true })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', select: true })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', select: true })
  deletedAt?: Date;
}
