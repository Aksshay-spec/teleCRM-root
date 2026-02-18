//src/lead/lead.controller.ts
import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { L1Guard } from '../common/guards/l1.guard';
import { LeadService } from './lead.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { ApproveLeadDto } from './dto/approve-lead.dto';
import type { Request } from 'express';

// @UseGuards(JwtAuthGuard)
// @Controller('leads')
// export class LeadController {
//   constructor(private leadService: LeadService) {}

//   @Post()
//   create(@Body() dto: CreateLeadDto, @Req() req: Request) {
//     return this.leadService.createLead(dto, req.user);
//   }

//   @Get()
//   list(
//     @Query('status') status: any,
//     @Req() req: Request,
//   ) {
//     return this.leadService.listLeads(
//       (req.user as any).organizationId,
//       status,
//     );
//   }

//   @UseGuards(L1Guard)
//   @Patch(':leadId/approve')
//   approve(
//     @Param('leadId') leadId: string,
//     @Body() dto: ApproveLeadDto,
//     @Req() req: Request,
//   ) {
//     return this.leadService.approveLead(
//       leadId,
//       dto,
//       req.user,
//     );
//   }
// }

@UseGuards(JwtAuthGuard, L1Guard)
@Controller('leads')
export class LeadController {
  constructor(private leadService: LeadService) {}

  @Post()
  create(@Body() dto: CreateLeadDto, @Req() req: Request) {
    return this.leadService.createLead(dto, req.user);
  }

  @Get()
  list(@Req() req: Request) {
    return this.leadService.listLeads(
      (req.user as any).organizationId,
    );
  }

  @Patch(':leadId/approve')
  approve(
    @Param('leadId') leadId: string,
    @Body() dto: ApproveLeadDto,
    @Req() req: Request,
  ) {
    return this.leadService.approveLead(
      leadId,
      dto,
      req.user,
    );
  }
}
