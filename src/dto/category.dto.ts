import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'JavaScript', description: 'Category name' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

