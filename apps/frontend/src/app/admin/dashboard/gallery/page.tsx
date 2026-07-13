'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { galleryService } from '../../../../services';
import type { GalleryImage } from '../../../../types';

export default function GalleryAdminPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await galleryService.list();
    setImages(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const onUpload = async (file: File) => {
    try {
      await galleryService.upload(file);
      toast.success('Image uploaded');
      load();
    } catch {
      toast.error('Upload failed');
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm('Delete this image?')) return;
    await galleryService.remove(id);
    toast.success('Image deleted');
    load();
  };

  return (
    <div>
      <h1 className="text-2xl mb-6">Gallery</h1>

      <label className="btn-primary inline-block cursor-pointer mb-8">
        Upload image
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
        />
      </label>

      {loading ? (
        <p className="text-[var(--color-text-muted)]">Loading…</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="relative group card-surface overflow-hidden aspect-square">
              <Image src={img.url} alt={img.caption || ''} fill className="object-cover" />
              <button
                onClick={() => onDelete(img.id)}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
