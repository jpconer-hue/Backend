
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SavingsController } from './savings.controller';
import { SavingsService } from './savings.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [ DatabaseModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [SavingsController],
  providers: [SavingsService],
  exports: [SavingsService],
})
export class SavingsModule {}
