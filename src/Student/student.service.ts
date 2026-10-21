
import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class StudentsService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  // Create student
  async createStudent(
    student_name: string,
    course: string,
    year_level: string,
  ) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO Student (student_name, course, year_level) VALUES (?, ?, ?)',
      [student_name, course, year_level],
    );

    return this.findById(result.insertId);
  }

  // Find student by ID
  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM Student WHERE student_id = ?',
      [id],
    );

    if (rows.length === 0) {
      throw new NotFoundException(
        `Student with ID ${id} was not found`,
      );
    }

    return rows[0];
  }

  // Get all students
  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM Student',
    );

    return rows;
  }

  // Update student
  async updateStudent(
    id: number,
    partial: {
      student_name?: string;
      course?: string;
      year_level?: string;
    },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.student_name !== undefined) {
      fields.push('student_name = ?');
      values.push(partial.student_name);
    }

    if (partial.course !== undefined) {
      fields.push('course = ?');
      values.push(partial.course);
    }

    if (partial.year_level !== undefined) {
      fields.push('year_level = ?');
      values.push(partial.year_level);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    const sql = `UPDATE Student SET ${fields.join(', ')} WHERE student_id = ?`;

    await this.pool().execute(sql, values);

    return this.findById(id);
  }

  // Delete student
  async deleteStudent(id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM Student WHERE student_id = ?',
      [id],
    );

    if (res.affectedRows === 0) {
      throw new NotFoundException(
        `Student with ID ${id} was not found`,
      );
    }

    return {
      message: 'Student deleted successfully',
      deleted: res.affectedRows > 0,
    };
  }
}
