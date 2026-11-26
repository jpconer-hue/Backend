import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request,
} from '@nestjs/common';

import { AllowancesService } from './allowance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('allowances')
export class AllowancesController {
  constructor(
    private allowancesService: AllowancesService,
  ) {}

  // Get all allowances
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(@Request() req: any) {
    return this.allowancesService.getAll();
  }

  // Get one allowance by ID
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.allowancesService.findById(+id);
  }

  // Create an allowance
  @Post()
  async create(
    @Body()
    body: {
      allowance_date: string;
      allowance_amount: string;
      student_id: number;
    },
  ) {
    return this.allowancesService.createAllowance(
      body.allowance_date,
      body.allowance_amount,
      body.student_id,
    );
  }

  // Update an allowance
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      allowance_date?: string;
      allowance_amount?: string;
      student_id?: number;
    },
    @Request() req: any,
  ) {
    return this.allowancesService.updateAllowance(+id, body);
  }

  // Delete an allowance
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.allowancesService.deleteAllowance(+id);
  }
}
