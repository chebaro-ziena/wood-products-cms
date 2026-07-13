import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function getGallery() {
  try {
    const res = await fetch(`${API_URL}/api/gallery`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function GalleryPage() {
  const images = await getGallery();

  return (
    <div className="py-10">
      <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-display mb-8">Gallery</h1>
      {images.length === 0 ? (
        <p className="text-[var(--color-text-muted)]">No images yet.</p>
      ) : (
        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {images.map((img: any) => (
            <div key={img.id} className="relative break-inside-avoid rounded-md overflow-hidden bg-[var(--color-ink-800)]">
              <Image
                src={img.url}
                alt={img.caption || 'Gallery image'}
                width={500}
                height={500}
                className="w-full h-auto object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
