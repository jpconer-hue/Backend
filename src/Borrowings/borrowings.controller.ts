
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';

import { BorrowingsService } from './borrowings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('borrowings')
export class BorrowingsController {
  constructor(private borrowingsService: BorrowingsService) {}

  // Get all borrowings (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.borrowingsService.getAll();
  }

  // Get one borrowing by ID (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.borrowingsService.findById(+id);
  }

  // Create borrowing (open - for demo)
  @Post()
  async create(
    @Body() body: { member_id: number; book_id: number },
  ) {
    return this.borrowingsService.createBorrowing(
      body.member_id,
      body.book_id,
    );
  }

  // Update borrowing (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { member_id?: number; book_id?: number },
  ) {
    return this.borrowingsService.updateBorrowing(+id, body);
  }

  // Delete borrowing (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.borrowingsService.deleteBorrowing(+id);
  }
}