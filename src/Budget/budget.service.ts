
import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class BudgetsService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createBudget(
    budget_period: string,
    budget_amount: string,
    student_id: number,
  ) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO Budget (budget_period, budget_amount, student_id) VALUES (?, ?, ?)',
      [budget_period, budget_amount, student_id],
    );

    return this.findById(result.insertId);
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM Budget WHERE budget_id = ?',
      [id],
    );

    if (rows.length === 0) {
      throw new NotFoundException(
        `Budget with ID ${id} was not found`,
      );
    }

    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM Budget',
    );

    return rows;
  }

  async updateBudget(
    id: number,
    partial: {
      budget_period?: string;
      budget_amount?: string;
      student_id?: number;
    },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.budget_period !== undefined) {
      fields.push('budget_period = ?');
      values.push(partial.budget_period);
    }

    if (partial.budget_amount !== undefined) {
      fields.push('budget_amount = ?');
      values.push(partial.budget_amount);
    }

    if (partial.student_id !== undefined) {
      fields.push('student_id = ?');
      values.push(partial.student_id);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    const sql = `UPDATE Budget SET ${fields.join(', ')} WHERE budget_id = ?`;

    await this.pool().execute(sql, values);

    return this.findById(id);
  }

  async deleteBudget(id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM Budget WHERE budget_id = ?',
      [id],
    );

    if (res.affectedRows === 0) {
      throw new NotFoundException(
        `Budget with ID ${id} was not found`,
      );
    }

    return {
      message: 'Budget deleted successfully',
      deleted: res.affectedRows > 0,
    };
  }
}
