-- AlterTable
ALTER TABLE "homepage" ADD COLUMN     "advantages" TEXT[] DEFAULT ARRAY['In-house carpentry production', 'We only treat wood with environmentally friendly and safe products', 'Prices from the manufacturer, no extra charges']::TEXT[],
ADD COLUMN     "advantagesImageUrl" TEXT;
