import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HomepageService, AboutImageSlot } from './homepage.service';
import { UpdateHomepageDto } from './dto/update-homepage.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadService } from '../upload/upload.service';

const ABOUT_IMAGE_SLOTS: AboutImageSlot[] = ['main', 'top', 'bottom'];

function assertSlot(slot: string): AboutImageSlot {
  if (!ABOUT_IMAGE_SLOTS.includes(slot as AboutImageSlot)) {
    throw new BadRequestException(`Invalid image slot "${slot}" — expected main, top, or bottom`);
  }
  return slot as AboutImageSlot;
}

@ApiTags('homepage')
@Controller('homepage')
export class HomepageController {
  constructor(
    private readonly homepageService: HomepageService,
    private readonly uploadService: UploadService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get homepage content (public)' })
  get() {
    return this.homepageService.get();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put()
  @ApiOperation({ summary: 'Update homepage content (admin only)' })
  update(@Body() dto: UpdateHomepageDto) {
    return this.homepageService.update(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @Post('banners')
  @ApiOperation({ summary: 'Upload a hero image for the homepage banner (admin only, max 3)' })
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async addBanner(@UploadedFile() file: Express.Multer.File, @Body('title') title?: string) {
    const url = await this.uploadService.store(file);
    return this.homepageService.addBanner(url, title);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('banners/:id')
  @ApiOperation({ summary: 'Delete a hero image (admin only)' })
  removeBanner(@Param('id') id: string) {
    return this.homepageService.removeBanner(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put('banners/reorder')
  @ApiOperation({ summary: 'Reorder hero images (admin only)' })
  reorderBanners(@Body('banners') banners: { id: string; order: number }[]) {
    return this.homepageService.reorderBanners(banners);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @Post('about-images/:slot')
  @ApiOperation({ summary: 'Upload an About Us box image — slot is main, top, or bottom (admin only)' })
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async uploadAboutImage(@Param('slot') slot: string, @UploadedFile() file: Express.Multer.File) {
    const url = await this.uploadService.store(file);
    return this.homepageService.setAboutImage(assertSlot(slot), url);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('about-images/:slot')
  @ApiOperation({ summary: 'Remove an About Us box image (admin only)' })
  removeAboutImage(@Param('slot') slot: string) {
    return this.homepageService.setAboutImage(assertSlot(slot), null);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @Post('advantages-image')
  @ApiOperation({ summary: 'Upload the Advantages section image (admin only)' })
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async uploadAdvantagesImage(@UploadedFile() file: Express.Multer.File) {
    const url = await this.uploadService.store(file);
    return this.homepageService.setAdvantagesImage(url);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('advantages-image')
  @ApiOperation({ summary: 'Remove the Advantages section image (admin only)' })
  removeAdvantagesImage() {
    return this.homepageService.setAdvantagesImage(null);
  }
}
