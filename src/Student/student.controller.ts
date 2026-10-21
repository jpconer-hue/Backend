import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request,
} from '@nestjs/common';

import { StudentsService } from './student.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('students')
export class StudentsController {
  constructor(private studentsService: StudentsService) {}

  // Get all students
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(@Request() req: any) {
    return this.studentsService.getAll();
  }

  // Get one student by ID
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.studentsService.findById(+id);
  }

  // Create a student
  @Post()
  async create(
    @Body()
    body: {
      student_name: string;
      course: string;
      year_level: string;
    },
  ) {
    return this.studentsService.createStudent(
      body.student_name,
      body.course,
      body.year_level,
    );
  }

  // Update a student
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      student_name?: string;
      course?: string;
      year_level?: string;
    },
    @Request() req: any,
  ) {
    return this.studentsService.updateStudent(+id, body);
  }

  // Delete a student
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.studentsService.deleteStudent(+id);
  }
}
