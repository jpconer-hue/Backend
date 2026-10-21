
import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class AllowancesService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createAllowance(
    allowance_date: string,
    allowance_amount: string,
    student_id: number,
  ) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO Allowance (allowance_date, allowance_amount, student_id) VALUES (?, ?, ?)',
      [allowance_date, allowance_amount, student_id],
    );

    return this.findById(result.insertId);
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM Allowance WHERE allowance_id = ?',
      [id],
    );

    if (rows.length === 0) {
      throw new NotFoundException(
        `Allowance with ID ${id} was not found`,
      );
    }

    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM Allowance',
    );

    return rows;
  }

  async updateAllowance(
    id: number,
    partial: {
      allowance_date?: string;
      allowance_amount?: string;
      student_id?: number;
    },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.allowance_date !== undefined) {
      fields.push('allowance_date = ?');
      values.push(partial.allowance_date);
    }

    if (partial.allowance_amount !== undefined) {
      fields.push('allowance_amount = ?');
      values.push(partial.allowance_amount);
    }

    if (partial.student_id !== undefined) {
      fields.push('student_id = ?');
      values.push(partial.student_id);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    const sql = `UPDATE Allowance SET ${fields.join(', ')} WHERE allowance_id = ?`;

    await this.pool().execute(sql, values);

    return this.findById(id);
  }

  async deleteAllowance(id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM Allowance WHERE allowance_id = ?',
      [id],
    );

    if (res.affectedRows === 0) {
      throw new NotFoundException(
        `Allowance with ID ${id} was not found`,
      );
    }

    return {
      message: 'Allowance deleted successfully',
      deleted: res.affectedRows > 0,
    };
  }
}
