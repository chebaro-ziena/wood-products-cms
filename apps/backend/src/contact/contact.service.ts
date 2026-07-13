import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateContactDto) {
    return this.prisma.contactSubmission.create({ data: dto });
  }

  findAll() {
    return this.prisma.contactSubmission.findMany({ orderBy: { createdAt: 'desc' } });
  }

  markRead(id: string) {
    return this.prisma.contactSubmission.update({ where: { id }, data: { read: true } });
  }
}
