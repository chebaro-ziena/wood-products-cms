import {
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
import { GalleryService } from './gallery.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadService } from '../upload/upload.service';

@ApiTags('gallery')
@Controller('gallery')
export class GalleryController {
  constructor(
    private readonly galleryService: GalleryService,
    private readonly uploadService: UploadService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List gallery images (public)' })
  findAll() {
    return this.galleryService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @Post()
  @ApiOperation({ summary: 'Upload a gallery image (admin only)' })
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async add(@UploadedFile() file: Express.Multer.File, @Body('caption') caption?: string) {
    const url = await this.uploadService.store(file);
    return this.galleryService.add(url, caption);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a gallery image (admin only)' })
  remove(@Param('id') id: string) {
    return this.galleryService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put('reorder')
  @ApiOperation({ summary: 'Reorder gallery images via drag & drop (admin only)' })
  reorder(@Body('images') images: { id: string; order: number }[]) {
    return this.galleryService.reorder(images);
  }
}
