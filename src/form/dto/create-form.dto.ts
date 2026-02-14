//src/form/dto/create-form.dto.ts
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ProcessType } from '@prisma/client';

export class CreateFormDto {
  @IsEnum(ProcessType)
  processType: ProcessType;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
