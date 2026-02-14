//src/lead/dto/create-lead.dto.ts
import { IsObject, IsOptional, IsString } from 'class-validator';

export class CreateLeadDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsObject()
  data?: Record<string, any>;
}
