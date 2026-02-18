//src/form/form.controller.ts
import {
  Body,
  Controller,
  Post,
  Patch,
  Param,
  Get,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { L1Guard } from '../common/guards/l1.guard';
import { FormService } from './form.service';
import { CreateFormDto } from './dto/create-form.dto';
import { AddFieldDto } from './dto/add-field.dto';

@UseGuards(JwtAuthGuard)
@Controller('forms')
export class FormController {
  constructor(private formService: FormService) {}

  @UseGuards(L1Guard)
  @Post()
  createForm(@Body() dto: CreateFormDto, @Req() req: Request) {
    const organizationId = (req.user as any).organizationId;
    return this.formService.createForm(dto, organizationId);
  }

  @UseGuards(L1Guard)
  @Post(':formId/fields')
  addField(
    @Param('formId') formId: string,
    @Body() dto: AddFieldDto,
    @Req() req: Request,
  ) {
    const organizationId = (req.user as any).organizationId;
    return this.formService.addField(formId, dto, organizationId);
  }

  @UseGuards(L1Guard)
  @Patch(':formId/activate')
  activate(@Param('formId') formId: string, @Req() req: Request) {
    const organizationId = (req.user as any).organizationId;
    return this.formService.activateForm(formId, organizationId);
  }

  @Get('active')
  getActive(@Query('processType') processType: string, @Req() req: Request) {
    const organizationId = (req.user as any).organizationId;
    return this.formService.getActiveForm(processType, organizationId);
  }
}
