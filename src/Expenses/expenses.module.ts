
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [ DatabaseModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [ExpensesController],
  providers: [ExpensesService],
  exports: [ExpensesService],
})
export class ExpensesModule {}
