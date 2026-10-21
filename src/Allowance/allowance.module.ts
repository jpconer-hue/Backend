
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AllowancesController } from './allowance.controller';
import { AllowancesService } from './allowance.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [ DatabaseModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [AllowancesController],
  providers: [AllowancesService],
  exports: [AllowancesService],
})
export class AllowancesModule {}
