//src/lead/dto/approve-lead.dto.ts
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApprovalStatus } from '@prisma/client';

export class ApproveLeadDto {
  @IsEnum(ApprovalStatus)
  status: ApprovalStatus;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
