import { api } from '../lib/api';
import type {
  Homepage,
  Banner,
  Product,
  Service,
  GalleryImage,
  PriceCategory,
  PriceItemInput,
  AuthUser,
  AboutImageSlot,
} from '../types';

export const authService = {
  login: (email: string, password: string) =>
    api.post<{ accessToken: string; user: AuthUser }>('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
};

export const homepageService = {
  get: () => api.get<Homepage>('/homepage'),
  update: (data: Partial<Homepage>) => api.put<Homepage>('/homepage', data),
  uploadBanner: (file: File, title?: string) => {
    const form = new FormData();
    form.append('file', file);
    if (title) form.append('title', title);
    return api.post<Banner>('/homepage/banners', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  removeBanner: (id: string) => api.delete(`/homepage/banners/${id}`),
  reorderBanners: (banners: { id: string; order: number }[]) =>
    api.put<Banner[]>('/homepage/banners/reorder', { banners }),
  uploadAboutImage: (slot: AboutImageSlot, file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post<Homepage>(`/homepage/about-images/${slot}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  removeAboutImage: (slot: AboutImageSlot) => api.delete<Homepage>(`/homepage/about-images/${slot}`),
  uploadAdvantagesImage: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post<Homepage>('/homepage/advantages-image', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  removeAdvantagesImage: () => api.delete<Homepage>('/homepage/advantages-image'),
};

export const productsService = {
  list: (params?: { status?: string; search?: string; page?: number }) =>
    api.get<{ items: Product[]; total: number; page: number; pageCount: number }>('/products', {
      params,
    }),
  get: (id: string) => api.get<Product>(`/products/${id}`),
  create: (data: Partial<Product>) => api.post<Product>('/products', data),
  update: (id: string, data: Partial<Product>) => api.patch<Product>(`/products/${id}`, data),
  remove: (id: string) => api.delete(`/products/${id}`),
  uploadImage: (id: string, file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post(`/products/${id}/images`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  removeImage: (id: string, imageId: string) => api.delete(`/products/${id}/images/${imageId}`),
  reorderImages: (id: string, images: { id: string; order: number }[]) =>
    api.put(`/products/${id}/reorder`, { images }),
};

export const servicesService = {
  list: () => api.get<Service[]>('/services'),
  create: (data: Partial<Service>) => api.post<Service>('/services', data),
  update: (id: string, data: Partial<Service>) => api.patch<Service>(`/services/${id}`, data),
  remove: (id: string) => api.delete(`/services/${id}`),
};

export const galleryService = {
  list: () => api.get<GalleryImage[]>('/gallery'),
  upload: (file: File, caption?: string) => {
    const form = new FormData();
    form.append('file', file);
    if (caption) form.append('caption', caption);
    return api.post('/gallery', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  remove: (id: string) => api.delete(`/gallery/${id}`),
  reorder: (images: { id: string; order: number }[]) => api.put('/gallery/reorder', { images }),
};

export const priceListService = {
  list: () => api.get<PriceCategory[]>('/prices'),
  create: (data: { name: string; items: PriceItemInput[] }) =>
    api.post<PriceCategory>('/prices', data),
  update: (id: string, data: { name: string; items: PriceItemInput[] }) =>
    api.put<PriceCategory>(`/prices/${id}`, data),
  remove: (id: string) => api.delete(`/prices/${id}`),
};

export const contactService = {
  submit: (data: { name: string; phone: string; question: string }) =>
    api.post('/contact', data),
};
