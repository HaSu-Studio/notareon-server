import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../models/category.entity';
import { CheatSheet } from '../models/cheat-sheet.entity';
import { CreateCategoryDto } from '../dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(CheatSheet)
    private cheatSheetRepository: Repository<CheatSheet>,
  ) {}

  async findAll(userId: string): Promise<string[]> {
    const categories = await this.categoryRepository.find({
      where: { userId },
    });

    const cheatSheetCategories = await this.cheatSheetRepository
      .createQueryBuilder('cheatSheet')
      .select('DISTINCT cheatSheet.category', 'category')
      .where('cheatSheet.userId = :userId', { userId })
      .getRawMany();

    const allCategories = new Set<string>();
    categories.forEach((cat) => allCategories.add(cat.name));
    cheatSheetCategories.forEach((item) => {
      if (item.category) {
        allCategories.add(item.category);
      }
    });

    return Array.from(allCategories).sort();
  }

  async create(createDto: CreateCategoryDto, userId: string): Promise<Category> {
    const existing = await this.categoryRepository.findOne({
      where: { name: createDto.name, userId },
    });

    if (existing) {
      throw new ConflictException('Category already exists');
    }

    const category = this.categoryRepository.create({
      ...createDto,
      userId,
    });

    return this.categoryRepository.save(category);
  }

  async delete(name: string, userId: string, force: boolean = false): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { name, userId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const cheatSheetsCount = await this.cheatSheetRepository.count({
      where: { category: name, userId },
    });

    if (cheatSheetsCount > 0 && !force) {
      throw new ConflictException(
        'Cannot delete category with cheat sheets. Use force=true to delete all cheat sheets.',
      );
    }

    if (force && cheatSheetsCount > 0) {
      await this.cheatSheetRepository.delete({
        category: name,
        userId,
      });
    }

    await this.categoryRepository.remove(category);
  }
}

