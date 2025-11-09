import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CheatSheet } from '../models/cheat-sheet.entity';
import { CreateCheatSheetDto, UpdateCheatSheetDto } from '../dto/cheat-sheet.dto';

@Injectable()
export class CheatSheetService {
  constructor(
    @InjectRepository(CheatSheet)
    private cheatSheetRepository: Repository<CheatSheet>,
  ) {}

  async findAll(userId: string): Promise<CheatSheet[]> {
    return this.cheatSheetRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<CheatSheet> {
    const cheatSheet = await this.cheatSheetRepository.findOne({
      where: { id },
    });

    if (!cheatSheet) {
      throw new NotFoundException('Cheat sheet not found');
    }

    if (cheatSheet.userId !== userId) {
      throw new ForbiddenException('You do not have access to this cheat sheet');
    }

    return cheatSheet;
  }

  async create(
    createDto: CreateCheatSheetDto,
    userId: string,
  ): Promise<CheatSheet> {
    const cheatSheet = this.cheatSheetRepository.create({
      ...createDto,
      userId,
    });

    return this.cheatSheetRepository.save(cheatSheet);
  }

  async update(
    id: string,
    updateDto: UpdateCheatSheetDto,
    userId: string,
  ): Promise<CheatSheet> {
    const cheatSheet = await this.findOne(id, userId);

    Object.assign(cheatSheet, updateDto);
    return this.cheatSheetRepository.save(cheatSheet);
  }

  async delete(id: string, userId: string): Promise<void> {
    const cheatSheet = await this.findOne(id, userId);
    await this.cheatSheetRepository.remove(cheatSheet);
  }
}

