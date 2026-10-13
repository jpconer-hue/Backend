
import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class BorrowingsService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createBorrowing(member_id: number, book_id: number) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO Borrowings (member_id, book_id) VALUES (?, ?)',
      [member_id, book_id],
    );

    return {
      borrowing_id: result.insertId,
      member_id,
      book_id,
    };
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM Borrowings',
    );

    return rows;
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM Borrowings WHERE borrowing_id = ?',
      [id],
    );

    if (rows.length === 0) {
      throw new NotFoundException('Borrowing not found');
    }

    return rows[0];
  }

  async updateBorrowing(
    id: number,
    partial: { member_id?: number; book_id?: number },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.member_id !== undefined) {
      fields.push('member_id = ?');
      values.push(partial.member_id);
    }

    if (partial.book_id !== undefined) {
      fields.push('book_id = ?');
      values.push(partial.book_id);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    await this.pool().execute(
      `UPDATE Borrowings SET ${fields.join(', ')} WHERE borrowing_id = ?`,
      values,
    );

    return this.findById(id);
  }

  async deleteBorrowing(id: number) {
    const [result] = await this.pool().execute<OkPacket>(
      'DELETE FROM Borrowings WHERE borrowing_id = ?',
      [id],
     );
    return result.affectedRows > 0;
  }


  async setRefreshToken(id: number, refreshToken: string | null) {
    await this.pool().execute(
      'UPDATE Members SET refresh_token = ? WHERE member_id = ?',
      [refreshToken, id],
    );
  }

  async findByRefreshToken(refreshToken: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT member_id, member_name, phone FROM Members WHERE refresh_token = ?',
      [refreshToken],
    );

    return rows[0];
  }
}
