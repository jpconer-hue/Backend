
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { StudentsController } from './student.controller';
import { StudentsService } from './student.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [ DatabaseModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
