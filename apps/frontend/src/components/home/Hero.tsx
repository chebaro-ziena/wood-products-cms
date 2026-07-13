import Image from 'next/image';
import { SectionContainer } from './SectionContainer';

interface Thumb {
  imageUrl: string;
  title?: string;
}

interface HeroProps {
  title: string;
  subtitle?: string;
  thumbs: Thumb[];
}

// Desktop canvas positions, read from Figma Inspect against the reference
// card (1245x714) and converted to % of the card so they stay exact at any
// width while the card's own aspect-ratio stays locked to 1245/714.
const FLOATING_BOXES = [
  { top: pct(43, 714), left: pct(925, 1245), z: 'z-30' }, // top-right
  { top: pct(316, 714), left: pct(680, 1245), z: 'z-20' }, // mid-left
  { top: pct(452, 714), left: pct(925, 1245), z: 'z-10' }, // bottom-right
];

function pct(value: number, ref: number) {
  return `${((value / ref) * 100).toFixed(2)}%`;
}

export function Hero({ title, subtitle, thumbs }: HeroProps) {
  return (
    <SectionContainer as="div" variant="card" className="mt-24 md:mt-32">
      {/* Mobile / tablet — Figma only specs desktop, so this is an adapted stack */}
      <div className="lg:hidden grid md:grid-cols-2 gap-10 items-center px-6 md:px-12 py-16 md:py-24">
        <div>
          <h1 className="text-4xl md:text-6xl leading-[1.05] mb-6">{title}</h1>
          {subtitle && (
            <p className="text-[var(--color-text-muted)] normal-case max-w-sm mb-8">{subtitle}</p>
          )}
          <a href="#order" className="btn-primary inline-block">
            Order
          </a>
        </div>

        <div className="relative h-[320px] sm:h-[400px] md:h-[480px] w-full max-w-[280px] sm:max-w-[340px] md:max-w-[420px] justify-self-center md:justify-self-end">
          {[
            { top: '0%', right: '0%', left: 'auto', z: 'z-10' },
            { top: '28%', left: '0%', right: 'auto', z: 'z-20' },
            { top: '56%', right: '0%', left: 'auto', z: 'z-30' },
          ].map((pos, i) => {
            const thumb = thumbs[i];
            return (
              <div
                key={i}
                className={`absolute ${pos.z} w-[110px] h-[110px] sm:w-[150px] sm:h-[150px] md:w-[190px] md:h-[190px] rounded-2xl sm:rounded-3xl md:rounded-[2rem] overflow-hidden border border-white/5 shadow-xl bg-[var(--color-ink-700)]`}
                style={{
                  top: pos.top,
                  left: pos.left !== 'auto' ? pos.left : undefined,
                  right: pos.right !== 'auto' ? pos.right : undefined,
                }}
              >
                {thumb?.imageUrl && (
                  <Image src={thumb.imageUrl} alt={thumb.title || ''} fill className="object-cover" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop — pixel-accurate canvas, positions %-of-card from Figma Inspect.
          @container + cqw-based text sizing keeps the title proportional to the
          card's actual rendered width (capped at 1245px by SectionContainer)
          instead of assuming a fixed px value that clips at narrower widths. */}
      <div className="hidden lg:block relative aspect-[1245/714] @container">
        <div
          className="absolute flex flex-col"
          style={{ left: pct(50, 1245), top: pct(75, 714), width: pct(622, 1245) }}
        >
          <h1 className="font-title text-[7.229cqw] leading-[1.15] font-medium uppercase">{title}</h1>
          {subtitle && (
            <p className="text-[#FFDBBB] font-inter font-normal text-[2.41cqw] leading-[130%] normal-case max-w-sm mt-4">
              {subtitle}
            </p>
          )}
        </div>

        {/* Vertical divider — sits exactly where the text column ends */}
       <div
  className="absolute w-[2px] bg-white/10"
  style={{ left: pct(672, 1245), top: pct(75, 714), height: pct(537, 714) }}
/>

        <a
          href="#order"
          className="absolute inline-flex items-center justify-center rounded-[42px] bg-[#728BAD] text-white transition duration-300 hover:bg-[#839BC0]"
          style={{
            left: pct(50, 1245),
            top: pct(554, 714),
            width: 225,
            height: 58,
            paddingLeft: 70,
            paddingRight: 70,
          }}
        >
          Order
        </a>


        {FLOATING_BOXES.map((pos, i) => {
          const thumb = thumbs[i];
          return (
            <div
              key={i}
              className={`absolute ${pos.z} overflow-hidden rounded-[2.5rem] md:rounded-[3.2rem] border border-white/5 shadow-xl bg-[var(--color-ink-700)]`}
              style={{ top: pos.top, left: pos.left, width: pct(235, 1245), height: pct(235, 714) }}
            >
              {thumb?.imageUrl && (
                <Image src={thumb.imageUrl} alt={thumb.title || ''} fill className="object-cover" />
              )}
            </div>
          );
        })}
      </div>
    </SectionContainer>
  );
}
