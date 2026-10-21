import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req
} from '@nestjs/common';

import { BudgetsService } from './budget.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('budget')
export class BudgetsController {
  constructor(private budgetsService: BudgetsService) {}

  // Get all budget records (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.budgetsService.getAll();
  }

  // Get single budget by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.budgetsService.findById(+id);
  }

  // Create budget (open - for demo)
  @Post()
  async create(
    @Body()
    body: {
      budget_period: string;
      budget_amount: string;
      student_id: number;
    },
  ) {
    return this.budgetsService.createBudget(
      body.budget_period,
      body.budget_amount,
      body.student_id,
    );
  }

  // Update budget (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.budgetsService.updateBudget(+id, body);
  }

  // Delete budget (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.budgetsService.deleteBudget(+id);
  }
}