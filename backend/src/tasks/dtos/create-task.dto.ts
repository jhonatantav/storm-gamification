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

@InputType()
export class CreateTaskDto {
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
}
