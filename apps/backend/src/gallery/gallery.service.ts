import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GalleryService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.galleryImage.findMany({ orderBy: { order: 'asc' } });
  }

  async add(url: string, caption?: string) {
    const count = await this.prisma.galleryImage.count();
    return this.prisma.galleryImage.create({ data: { url, caption, order: count } });
  }

  async remove(id: string) {
    const image = await this.prisma.galleryImage.findUnique({ where: { id } });
    if (!image) throw new NotFoundException('Gallery image not found');
    await this.prisma.galleryImage.delete({ where: { id } });
    return { success: true };
  }

  async reorder(images: { id: string; order: number }[]) {
    await this.prisma.$transaction(
      images.map((img) =>
        this.prisma.galleryImage.update({ where: { id: img.id }, data: { order: img.order } }),
      ),
    );
    return this.findAll();
  }
}
