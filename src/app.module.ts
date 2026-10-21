import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { BooksModule } from './Books/books.module';
import { BorrowingsModule } from './Borrowings/borrowings.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { StudentsModule } from './Student/student.module';
import { CategoriesModule } from './Category/category.module';
import { BudgetsModule } from './Budget/budget.module';
import { AllowancesModule } from './Allowance/allowance.module';
import { ExpensesModule } from './Expenses/expenses.module';
import { SavingsModule } from './Savings/savings.module';

@Module({
  imports: [ DatabaseModule, UsersModule, BooksModule, BorrowingsModule, AuthModule, StudentsModule,
  CategoriesModule, BudgetsModule, AllowancesModule, ExpensesModule, SavingsModule ],})

export class AppModule {}
