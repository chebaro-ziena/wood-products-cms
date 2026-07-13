import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateHomepageDto } from './dto/update-homepage.dto';

const MAX_HERO_BANNERS = 3;

export type AboutImageSlot = 'main' | 'top' | 'bottom';

const ABOUT_IMAGE_FIELD: Record<
  AboutImageSlot,
  'aboutImageUrl' | 'aboutTopImageUrl' | 'aboutBottomImageUrl'
> = {
  main: 'aboutImageUrl',
  top: 'aboutTopImageUrl',
  bottom: 'aboutBottomImageUrl',
};

@Injectable()
export class HomepageService {
  constructor(private readonly prisma: PrismaService) {}

  async get() {
    return this.prisma.homepage.upsert({
      where: { id: 'homepage' },
      update: {},
      create: { id: 'homepage' },
      include: { banners: { orderBy: { order: 'asc' } } },
    });
  }

  async update(dto: UpdateHomepageDto) {
    return this.prisma.homepage.upsert({
      where: { id: 'homepage' },
      update: dto,
      create: { id: 'homepage', ...dto },
      include: { banners: { orderBy: { order: 'asc' } } },
    });
  }

  async addBanner(imageUrl: string, title?: string) {
    await this.prisma.homepage.upsert({
      where: { id: 'homepage' },
      update: {},
      create: { id: 'homepage' },
    });

    const count = await this.prisma.banner.count({ where: { homepageId: 'homepage' } });
    if (count >= MAX_HERO_BANNERS) {
      throw new BadRequestException(`Only ${MAX_HERO_BANNERS} hero images are allowed`);
    }

    return this.prisma.banner.create({
      data: { title, imageUrl, order: count, homepageId: 'homepage' },
    });
  }

  async removeBanner(id: string) {
    const banner = await this.prisma.banner.findUnique({ where: { id } });
    if (!banner) throw new NotFoundException('Hero image not found');
    await this.prisma.banner.delete({ where: { id } });
    return { success: true };
  }

  async reorderBanners(banners: { id: string; order: number }[]) {
    await this.prisma.$transaction(
      banners.map((b) => this.prisma.banner.update({ where: { id: b.id }, data: { order: b.order } })),
    );
    return this.prisma.banner.findMany({
      where: { homepageId: 'homepage' },
      orderBy: { order: 'asc' },
    });
  }

  async setAboutImage(slot: AboutImageSlot, imageUrl: string | null) {
    const field = ABOUT_IMAGE_FIELD[slot];
    return this.prisma.homepage.upsert({
      where: { id: 'homepage' },
      update: { [field]: imageUrl },
      create: { id: 'homepage', [field]: imageUrl },
      include: { banners: { orderBy: { order: 'asc' } } },
    });
  }

  async setAdvantagesImage(imageUrl: string | null) {
    return this.prisma.homepage.upsert({
      where: { id: 'homepage' },
      update: { advantagesImageUrl: imageUrl },
      create: { id: 'homepage', advantagesImageUrl: imageUrl },
      include: { banners: { orderBy: { order: 'asc' } } },
    });
  }
}
