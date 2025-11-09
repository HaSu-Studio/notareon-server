import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CategoryController } from '../controllers/category.controller';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.entity';
import { CheatSheet } from '../models/cheat-sheet.entity';
import { AuthModule } from './auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category, CheatSheet]), AuthModule],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}

