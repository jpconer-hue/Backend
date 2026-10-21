
import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class ExpensesService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createExpense(
    expense_date: string,
    amount: string,
    student_id: number,
    category_id: number,
  ) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO Expenses (expense_date, amount, student_id, category_id) VALUES (?, ?, ?, ?)',
      [expense_date, amount, student_id, category_id],
    );

    return this.findById(result.insertId);
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM Expenses WHERE expense_id = ?',
      [id],
    );

    if (rows.length === 0) {
      throw new NotFoundException(
        `Expense with ID ${id} was not found`,
      );
    }

    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM Expenses',
    );

    return rows;
  }

  async updateExpense(
    id: number,
    partial: {
      expense_date?: string;
      amount?: string;
      student_id?: number;
      category_id?: number;
    },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.expense_date !== undefined) {
      fields.push('expense_date = ?');
      values.push(partial.expense_date);
    }

    if (partial.amount !== undefined) {
      fields.push('amount = ?');
      values.push(partial.amount);
    }

    if (partial.student_id !== undefined) {
      fields.push('student_id = ?');
      values.push(partial.student_id);
    }

    if (partial.category_id !== undefined) {
      fields.push('category_id = ?');
      values.push(partial.category_id);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    const sql = `UPDATE Expenses SET ${fields.join(', ')} WHERE expense_id = ?`;

    await this.pool().execute(sql, values);

    return this.findById(id);
  }

  async deleteExpense(id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM Expenses WHERE expense_id = ?',
      [id],
    );

    if (res.affectedRows === 0) {
      throw new NotFoundException(
        `Expense with ID ${id} was not found`,
      );
    }

    return {
      message: 'Expense deleted successfully',
      deleted: res.affectedRows > 0,
    };
  }
}
