'use client';

import { useState } from 'react';
import Image from 'next/image';

export function WorkCarousel({ images }: { images: { url: string; alt: string }[] }) {
  const [index, setIndex] = useState(0);

  const go = (delta: number) => {
    setIndex((i) => (i + delta + images.length) % images.length);
  };

  return (
    <div className="w-full max-w-[1245px] mx-auto px-6 md:px-16 mb-10 md:mb-12">
      <h1 className="font-title text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-wider mb-12 ml-4">
        Our Work
      </h1>

      {!images.length ? (
        <div className="relative aspect-[3/2] rounded-[32px] bg-[var(--color-ink-700)] flex items-center justify-center text-sm text-[var(--color-text-muted)]">
          No images yet
        </div>
      ) : (
        <div className="relative px-10 md:px-16">
          <div className="relative aspect-[3/2] rounded-[32px] overflow-hidden bg-[var(--color-ink-700)]">
            <Image src={images[index].url} alt={images[index].alt} fill className="object-cover" />
          </div>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous"
                className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 text-white/80 hover:text-white transition-colors"
              >
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next"
                className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 text-white/80 hover:text-white transition-colors"
              >
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            </>
          )}
        </div>
      )}

      {images.length > 1 && (
        <div className="flex justify-center items-center gap-3 mt-5">
          {images.map((img, i) => (
            <button
              key={img.url + i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={
                i === index
                  ? 'w-2.5 h-2.5 rounded-full bg-[var(--color-blue-300)] ring-4 ring-[var(--color-blue-300)]/30'
                  : 'w-2 h-2 rounded-full bg-white/25 hover:bg-white/40 transition-colors'
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
