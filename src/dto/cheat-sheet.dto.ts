import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCheatSheetDto {
  @ApiProperty({ example: 'JavaScript Array Methods', description: 'Cheat sheet title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'JavaScript', description: 'Category name' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: 'const arr = [1, 2, 3];\narr.map(x => x * 2);', description: 'Cheat sheet content' })
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class UpdateCheatSheetDto {
  @ApiProperty({ example: 'JavaScript Array Methods', description: 'Cheat sheet title', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'JavaScript', description: 'Category name', required: false })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ example: 'const arr = [1, 2, 3];\narr.map(x => x * 2);', description: 'Cheat sheet content', required: false })
  @IsString()
  @IsOptional()
  content?: string;
}

