import { Field, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { TaskCategory } from '../enums/task-category.enum';
import { Weekday } from '../enums/weekday.enum';
import { ICreateTask } from '../interfaces/create-task.interface';

@InputType()
export class CreateTaskDto implements ICreateTask {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => TaskCategory)
  @IsEnum(TaskCategory)
  @IsNotEmpty()
  category: TaskCategory;

  @Field(() => [Weekday])
  @IsArray()
  @IsEnum(Weekday, { each: true })
  @IsNotEmpty()
  weeklyFrequency: Weekday[];

  @Field()
  @IsString()
  @IsNotEmpty()
  userId: string;
}
