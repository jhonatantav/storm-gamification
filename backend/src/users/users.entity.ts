import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseAbstractEntity } from 'src/database/entities/base.entity';
import { Column, Entity } from 'typeorm';

@ObjectType()
@Entity('user')
export class UserEntity extends BaseAbstractEntity {
  @Field()
  @Column({ type: 'varchar', length: 255, unique: true })
  fullName: string;

  @Field()
  @Column({ type: 'varchar', length: 30, unique: true })
  nickName: string;

  @Field()
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Field()
  @Column({ type: 'varchar', length: 20, unique: true })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @Field(() => Int)
  @Column({ type: 'int', default: 1 })
  currentLevel: number;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 500, nullable: true })
  avatarUrl?: string;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  currentXp: number;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  totalXp: number;
}
