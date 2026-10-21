
import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class SavingsService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createSavings(
    savings_date: string,
    amount_saved: string,
    savings_goal: string,
    student_id: number,
  ) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO Savings (savings_date, amount_saved, savings_goal, student_id) VALUES (?, ?, ?, ?)',
      [savings_date, amount_saved, savings_goal, student_id],
    );

    return this.findById(result.insertId);
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM Savings WHERE savings_id = ?',
      [id],
    );

    if (rows.length === 0) {
      throw new NotFoundException(
        `Savings record with ID ${id} was not found`,
      );
    }

    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM Savings',
    );

    return rows;
  }

  async updateSavings(
    id: number,
    partial: {
      savings_date?: string;
      amount_saved?: string;
      savings_goal?: string;
      student_id?: number;
    },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.savings_date !== undefined) {
      fields.push('savings_date = ?');
      values.push(partial.savings_date);
    }

    if (partial.amount_saved !== undefined) {
      fields.push('amount_saved = ?');
      values.push(partial.amount_saved);
    }

    if (partial.savings_goal !== undefined) {
      fields.push('savings_goal = ?');
      values.push(partial.savings_goal);
    }

    if (partial.student_id !== undefined) {
      fields.push('student_id = ?');
      values.push(partial.student_id);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    const sql = `UPDATE Savings SET ${fields.join(', ')} WHERE savings_id = ?`;

    await this.pool().execute(sql, values);

    return this.findById(id);
  }

  async deleteSavings(id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM Savings WHERE savings_id = ?',
      [id],
    );

    if (res.affectedRows === 0) {
      throw new NotFoundException(
        `Savings record with ID ${id} was not found`,
      );
    }

    return {
      message: 'Savings record deleted successfully',
      deleted: res.affectedRows > 0,
    };
  }
}
