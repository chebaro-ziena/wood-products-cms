import Image from 'next/image';

interface WoodCardProps {
  name: string;
  image?: string;
  pros: string[];
  cons: string[];
}

// pros/cons share one icon color and only differ by ✓ / ✕ glyph — not by text color.
export function WoodCard({ name, image, pros, cons }: WoodCardProps) {
  return (
    <div>
      <div className="relative aspect-square w-[110px] h-[110px] sm:w-[140px] sm:h-[140px] lg:w-[150px] lg:h-[150px] rounded-2xl lg:rounded-[28px] overflow-hidden mb-4 bg-[var(--color-clay-300)]">
        {image && <Image src={image} alt={name} fill className="object-cover" />}
      </div>
      <p className="text-center normal-case text-lg sm:text-xl lg:text-2xl font-medium leading-none mb-3 lg:mb-4">
        {name}
      </p>
      <ul className="normal-case text-sm lg:text-base space-y-1.5 lg:space-y-2">
        {pros.map((p) => (
          <li key={p} className="flex gap-2">
            <span className="text-[var(--color-clay-500)]">✓</span>
            <span>{p}</span>
          </li>
        ))}
        {cons.map((c) => (
          <li key={c} className="flex gap-2">
            <span className="text-[var(--color-clay-500)]">✕</span>
            <span>{c}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
