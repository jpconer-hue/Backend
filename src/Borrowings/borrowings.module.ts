import { Module } from '@nestjs/common';
import { BorrowingsController } from './borrowings.controller';
import { BorrowingsService } from './borrowings.service';
import { DatabaseModule } from '../database/database.module';
import { PassportModule } from '@nestjs/passport';

@Module({
     imports: [DatabaseModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [BorrowingsController],
  providers: [BorrowingsService],
    exports: [BorrowingsService],
})
export class BorrowingsModule {}