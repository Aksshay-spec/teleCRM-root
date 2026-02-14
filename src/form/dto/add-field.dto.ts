//src/form/dto/add-field.dto.ts
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { FormFieldType } from '@prisma/client';

export class AddFieldDto {
  @IsString()
  key: string;

  @IsString()
  label: string;

  @IsEnum(FormFieldType)
  type: FormFieldType;

  @IsBoolean()
  required: boolean;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  options?: string[];

  @IsNumber()
  order: number;
}
