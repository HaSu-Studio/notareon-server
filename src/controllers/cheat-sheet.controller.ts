import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { CheatSheetService } from '../services/cheat-sheet.service';
import { CreateCheatSheetDto, UpdateCheatSheetDto } from '../dto/cheat-sheet.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Cheat Sheets')
@ApiBearerAuth()
@Controller('cheat-sheets')
@UseGuards(JwtAuthGuard)
export class CheatSheetController {
  constructor(private readonly cheatSheetService: CheatSheetService) {}

  @Get()
  @ApiOperation({ summary: 'Get all cheat sheets for current user' })
  @ApiResponse({ status: 200, description: 'List of cheat sheets' })
  findAll(@Request() req) {
    return this.cheatSheetService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get cheat sheet by ID' })
  @ApiParam({ name: 'id', description: 'Cheat sheet ID' })
  @ApiResponse({ status: 200, description: 'Cheat sheet found' })
  @ApiResponse({ status: 404, description: 'Cheat sheet not found' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.cheatSheetService.findOne(id, req.user.userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new cheat sheet' })
  @ApiResponse({ status: 201, description: 'Cheat sheet created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createDto: CreateCheatSheetDto, @Request() req) {
    return this.cheatSheetService.create(createDto, req.user.userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update cheat sheet' })
  @ApiParam({ name: 'id', description: 'Cheat sheet ID' })
  @ApiResponse({ status: 200, description: 'Cheat sheet updated successfully' })
  @ApiResponse({ status: 404, description: 'Cheat sheet not found' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateCheatSheetDto,
    @Request() req,
  ) {
    return this.cheatSheetService.update(id, updateDto, req.user.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete cheat sheet' })
  @ApiParam({ name: 'id', description: 'Cheat sheet ID' })
  @ApiResponse({ status: 204, description: 'Cheat sheet deleted successfully' })
  @ApiResponse({ status: 404, description: 'Cheat sheet not found' })
  delete(@Param('id') id: string, @Request() req) {
    return this.cheatSheetService.delete(id, req.user.userId);
  }
}

