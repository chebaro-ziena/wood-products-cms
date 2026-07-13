export interface Homepage {
  id: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl?: string | null;
  aboutTitle: string;
  aboutText: string;
  aboutImageUrl?: string | null;
  aboutTopImageUrl?: string | null;
  aboutBottomImageUrl?: string | null;
  advantagesImageUrl?: string | null;
  advantages: string[];
  contactTitle: string;
  contactSubtitle: string;
  contactPhone: string;
  contactAddress: string;
  banners: Banner[];
}
export type UpdateHomepage = {
  heroTitle?: string;
  heroSubtitle?: string;
  heroImageUrl?: string | null;
  aboutTitle?: string;
  aboutText?: string;
  aboutImageUrl?: string | null;
  aboutTopImageUrl?: string | null;
  aboutBottomImageUrl?: string | null;
  advantagesImageUrl?: string | null;
  advantages?: string[];
  contactTitle?: string;
  contactSubtitle?: string;
  contactPhone?: string;
  contactAddress?: string;
};

export type AboutImageSlot = 'main' | 'top' | 'bottom';

export interface Banner {
  id: string;
  title?: string | null;
  subtitle?: string | null;
  imageUrl?: string | null;
  order: number;
  isActive: boolean;
}

export type ProductStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface ProductImage {
  id: string;
  url: string;
  order: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price?: string | null;
  status: ProductStatus;
  featured: boolean;
  coverImage?: string | null;
  images: ProductImage[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  isActive: boolean;
  order: number;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption?: string | null;
  order: number;
}

export interface PriceListItem {
  id: string;
  categoryId: string;
  length: string; // délka (mm)
  width: string; // šířka (mm)
  thickness: string; // tloušťka (mm)
  pricePerM3: string; // cena m3
  pricePerPiece: string; // cena ks.
  m3: number; // computed server-side
  order: number;
}

export interface PriceCategory {
  id: string;
  name: string;
  order: number;
  items: PriceListItem[];
}

export type PriceItemInput = {
  length: number;
  width: number;
  thickness: number;
  pricePerM3: number;
  pricePerPiece: number;
};

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}
