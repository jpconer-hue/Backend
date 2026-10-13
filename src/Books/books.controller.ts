
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';

import { BooksService } from './books.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  // Get all books (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.booksService.getAll();
  }

  // Get one book by ID (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.booksService.findById(+id);
  }

  // Create book (open - for demo)
  @Post()
  async create(
    @Body() body: { book_title: string; author: string },
  ) {
    return this.booksService.createBook(
      body.book_title,
      body.author,
    );
  }

  // Update book (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { book_title?: string; author?: string },
  ) {
    return this.booksService.updateBook(+id, body);
  }

  // Delete book (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.booksService.deleteBook(+id);
  }
}