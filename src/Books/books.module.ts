import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { DatabaseModule } from '../database/database.module';
import { PassportModule } from '@nestjs/passport';

@Module({
     imports: [DatabaseModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [BooksController],
  providers: [BooksService],
    exports: [BooksService],
})
export class BooksModule {}