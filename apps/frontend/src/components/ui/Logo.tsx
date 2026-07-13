import Image from 'next/image';

const ASPECT_RATIO = 197 / 84;

export function Logo({ className = '', height = 40 }: { className?: string; height?: number }) {
  const width = Math.round(height * ASPECT_RATIO);

  return (
    <Image
      src="/logo-white.png"
      alt="BIO CWT"
      width={width}
      height={height}
      className={`shrink-0 ${className}`}
      priority
    />
  );
}
