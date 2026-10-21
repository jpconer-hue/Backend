import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request
} from '@nestjs/common';

import { ExpensesService } from './expenses.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('expenses')
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.expensesService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.expensesService.findById(+id);
  }

  @Post()
  async create(
    @Body()
    body: {
      expense_date: string;
      amount: string;
      student_id: number;
      category_id: number;
    },
  ) {
    return this.expensesService.createExpense(
      body.expense_date,
      body.amount,
      body.student_id,
      body.category_id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      expense_date?: string;
      amount?: string;
      student_id?: number;
      category_id?: number;
    },
  ) {
    return this.expensesService.updateExpense(+id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.expensesService.deleteExpense(+id);
  }
}
