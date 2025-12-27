import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseAbstractWithoutSoftDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    generated: 'increment',
  })
  seqId: number;

  @Column({
    type: 'boolean',
    default: true,
    select: false,
  })
  status: boolean;

  @CreateDateColumn({ type: 'timestamp', update: false, select: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', select: false })
  updatedAt: Date;
}
