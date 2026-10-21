
import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class CategoriesService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createCategory(
    category_name: string,
    category_description: string,
    priority: string,
  ) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO Category (category_name, category_description, priority) VALUES (?, ?, ?)',
      [category_name, category_description, priority],
    );

    return this.findById(result.insertId);
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM Category WHERE Category_id = ?',
      [id],
    );

    if (rows.length === 0) {
      throw new NotFoundException(
        `Category with ID ${id} was not found`,
      );
    }

    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM Category',
    );

    return rows;
  }

  async updateCategory(
    id: number,
    partial: {
      category_name?: string;
      category_description?: string;
      priority?: string;
    },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.category_name !== undefined) {
      fields.push('category_name = ?');
      values.push(partial.category_name);
    }

    if (partial.category_description !== undefined) {
      fields.push('category_description = ?');
      values.push(partial.category_description);
    }

    if (partial.priority !== undefined) {
      fields.push('priority = ?');
      values.push(partial.priority);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    const sql = `UPDATE Category SET ${fields.join(', ')} WHERE Category_id = ?`;

    await this.pool().execute(sql, values);

    return this.findById(id);
  }

  async deleteCategory(id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM Category WHERE Category_id = ?',
      [id],
    );

    if (res.affectedRows === 0) {
      throw new NotFoundException(
        `Category with ID ${id} was not found`,
      );
    }

    return {
      message: 'Category deleted successfully',
      deleted: res.affectedRows > 0,
    };
  }
}
