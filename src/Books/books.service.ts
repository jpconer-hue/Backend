
import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class BooksService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createBook(book_title: string, author: string) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO Books (book_title, author) VALUES (?, ?)',
      [book_title, author],
    );

    return {
      book_id: result.insertId,
      book_title,
      author,
    };
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM Books',
    );

    return rows;
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM Books WHERE book_id = ?',
      [id],
    );

    if (rows.length === 0) {
      throw new NotFoundException('Book not found');
    }

    return rows[0];
  }

  async updateBook(
    id: number,
    partial: { book_title?: string; author?: string },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.book_title !== undefined) {
      fields.push('book_title = ?');
      values.push(partial.book_title);
    }

    if (partial.author !== undefined) {
      fields.push('author = ?');
      values.push(partial.author);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    await this.pool().execute(
      `UPDATE Books SET ${fields.join(', ')} WHERE book_id = ?`,
      values,
    );

    return this.findById(id);
  }

  async deleteBook(id: number) {
    const [result] = await this.pool().execute<OkPacket>(
      'DELETE FROM Books WHERE book_id = ?',
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
