import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { BooksModule } from './Books/books.module';
import { BorrowingsModule } from './Borrowings/borrowings.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ DatabaseModule, UsersModule, BooksModule, BorrowingsModule, AuthModule ],
})
export class AppModule {}