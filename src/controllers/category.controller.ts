import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto } from '../dto/category.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories for current user' })
  @ApiResponse({ status: 200, description: 'List of categories' })
  findAll(@Request() req) {
    return this.categoryService.findAll(req.user.userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Category already exists' })
  create(@Body() createDto: CreateCategoryDto, @Request() req) {
    return this.categoryService.create(createDto, req.user.userId);
  }

  @Delete(':name')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete category' })
  @ApiParam({ name: 'name', description: 'Category name' })
  @ApiQuery({
    name: 'force',
    required: false,
    description: 'Force delete with cheat sheets',
    type: Boolean,
  })
  @ApiResponse({ status: 204, description: 'Category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({
    status: 409,
    description: 'Category has cheat sheets. Use force=true to delete',
  })
  delete(
    @Param('name') name: string,
    @Query('force') force: string,
    @Request() req,
  ) {
    return this.categoryService.delete(name, req.user.userId, force === 'true');
  }
}

