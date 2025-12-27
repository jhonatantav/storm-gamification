import { BaseAbstractEntity } from 'src/database/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('user')
export class UserEntity extends BaseAbstractEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  fullName: string;

  @Column({ type: 'varchar', length: 30, unique: true })
  nickName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ type: 'int', default: 1 })
  currentLevel: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatarUrl?: string;

  @Column({ type: 'int', default: 0 })
  currentXp: number;

  @Column({ type: 'int', default: 0 })
  totalXp: number;
}
