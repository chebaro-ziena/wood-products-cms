import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PriceListService } from './price-list.service';
import { CreatePriceCategoryDto, UpdatePriceCategoryDto } from './dto/price-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('prices')
@Controller('prices')
export class PriceListController {
  constructor(private readonly priceListService: PriceListService) {}

  @Get()
  @ApiOperation({ summary: 'List price categories with items (public)' })
  findAll() {
    return this.priceListService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create price category with items (admin only)' })
  create(@Body() dto: CreatePriceCategoryDto) {
    return this.priceListService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put(':id')
  @ApiOperation({ summary: 'Replace a price category name/items (admin only)' })
  update(@Param('id') id: string, @Body() dto: UpdatePriceCategoryDto) {
    return this.priceListService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a price category (admin only)' })
  remove(@Param('id') id: string) {
    return this.priceListService.remove(id);
  }
}
