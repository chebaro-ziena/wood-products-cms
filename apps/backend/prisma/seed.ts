import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@pixel38.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin123!';
  const hashed = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashed,
      name: 'Administrator',
    },
  });

  await prisma.homepage.upsert({
    where: { id: 'homepage' },
    update: {},
    create: {
      id: 'homepage',
      heroTitle: 'SOLID WOOD PRODUCTS',
      heroSubtitle: 'Crafted from the wood we work with',
      aboutTitle: 'ABOUT US',
      aboutText:
        'We craft solid wood products with precision and care, working closely with the finest materials to deliver lasting quality.',
      contactTitle: 'ANY QUESTIONS?',
      contactSubtitle:
        'Write to us and we will be sure to answer all your questions and give you a comprehensive consultation.',
    },
  });

  await prisma.service.createMany({
    data: [
      { title: 'Custom Furniture', description: 'Bespoke wood furniture made to order.', order: 0 },
      { title: 'Wood Restoration', description: 'Restoring and refinishing solid wood pieces.', order: 1 },
      { title: 'Interior Fit-Out', description: 'Full wood interior fit-out services.', order: 2 },
    ],
    skipDuplicates: true,
  });

  const priceCategoryCount = await prisma.priceCategory.count();
  if (priceCategoryCount === 0) {
    await prisma.priceCategory.create({
      data: {
        name: 'buk pr',
        order: 0,
        items: {
          create: [
            { length: 1000, width: 300, thickness: 40, pricePerM3: 1100, pricePerPiece: 462, order: 0 },
            { length: 1100, width: 300, thickness: 40, pricePerM3: 1100, pricePerPiece: 508.2, order: 1 },
            { length: 800, width: 300, thickness: 40, pricePerM3: 1100, pricePerPiece: 369.6, order: 2 },
            { length: 900, width: 300, thickness: 40, pricePerM3: 1100, pricePerPiece: 415.8, order: 3 },
          ],
        },
      },
    });

    await prisma.priceCategory.create({
      data: {
        name: 'buk cink',
        order: 1,
        items: {
          create: [
            { length: 3000, width: 400, thickness: 20, pricePerM3: 1000, pricePerPiece: 840, order: 0 },
            { length: 4000, width: 300, thickness: 20, pricePerM3: 1000, pricePerPiece: 840, order: 1 },
            { length: 4000, width: 400, thickness: 20, pricePerM3: 1000, pricePerPiece: 1120, order: 2 },
          ],
        },
      },
    });
  }

  console.log('Seed complete.');
  console.log(`Admin login -> email: ${adminEmail} / password: ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
