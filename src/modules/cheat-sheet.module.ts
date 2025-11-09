import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CheatSheetController } from '../controllers/cheat-sheet.controller';
import { CheatSheetService } from '../services/cheat-sheet.service';
import { CheatSheet } from '../models/cheat-sheet.entity';
import { AuthModule } from './auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([CheatSheet]), AuthModule],
  controllers: [CheatSheetController],
  providers: [CheatSheetService],
  exports: [CheatSheetService],
})
export class CheatSheetModule {}

