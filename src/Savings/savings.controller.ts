import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request,
} from '@nestjs/common';

import { SavingsService } from './savings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('savings')
export class SavingsController {
  constructor(private savingsService: SavingsService) {}

  // Get all savings records
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(@Request() req: any) {
    return this.savingsService.getAll();
  }

  // Get one savings record by ID
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.savingsService.findById(+id);
  }

  // Create a savings record
  @Post()
  async create(
    @Body()
    body: {
      savings_date: string;
      amount_saved: string;
      savings_goal: string;
      student_id: number;
    },
  ) {
    return this.savingsService.createSavings(
      body.savings_date,
      body.amount_saved,
      body.savings_goal,
      body.student_id,
    );
  }

  // Update a savings record
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      savings_date?: string;
      amount_saved?: string;
      savings_goal?: string;
      student_id?: number;
    },
    @Request() req: any,
  ) {
    return this.savingsService.updateSavings(+id, body);
  }

  // Delete a savings record
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.savingsService.deleteSavings(+id);
  }
}
