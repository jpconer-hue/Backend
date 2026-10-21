
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { BudgetsController } from './budget.controller';
import { BudgetsService } from './budget.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [ DatabaseModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [BudgetsController],
  providers: [BudgetsService],
  exports: [BudgetsService],
})
export class BudgetsModule {}
