import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePriceCategoryDto, UpdatePriceCategoryDto } from './dto/price-category.dto';

function withM3<T extends { length: any; width: any; thickness: any }>(item: T) {
  const m3 = (Number(item.length) * Number(item.width) * Number(item.thickness)) / 1_000_000_000;
  return { ...item, m3 };
}

function toDto(category: any) {
  return { ...category, items: category.items.map(withM3) };
}

@Injectable()
export class PriceListService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const categories = await this.prisma.priceCategory.findMany({
      orderBy: { order: 'asc' },
      include: { items: { orderBy: { order: 'asc' } } },
    });
    return categories.map(toDto);
  }

  async findOne(id: string) {
    const category = await this.prisma.priceCategory.findUnique({
      where: { id },
      include: { items: { orderBy: { order: 'asc' } } },
    });
    if (!category) throw new NotFoundException('Price category not found');
    return category;
  }

  async create(dto: CreatePriceCategoryDto) {
    const count = await this.prisma.priceCategory.count();
    const category = await this.prisma.priceCategory.create({
      data: {
        name: dto.name,
        order: count,
        items: {
          create: dto.items.map((item, order) => ({ ...item, order })),
        },
      },
      include: { items: { orderBy: { order: 'asc' } } },
    });
    return toDto(category);
  }

  async update(id: string, dto: UpdatePriceCategoryDto) {
    await this.findOne(id);

    const category = await this.prisma.$transaction(async (tx) => {
      await tx.priceListItem.deleteMany({ where: { categoryId: id } });
      return tx.priceCategory.update({
        where: { id },
        data: {
          name: dto.name,
          items: {
            create: dto.items.map((item, order) => ({ ...item, order })),
          },
        },
        include: { items: { orderBy: { order: 'asc' } } },
      });
    });

    return toDto(category);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.priceCategory.delete({ where: { id } });
    return { success: true };
  }
}
