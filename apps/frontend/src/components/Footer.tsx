import { Logo } from './ui/Logo';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const DEFAULT_PHONE = '+420 000 000 000';
const DEFAULT_ADDRESS = 'Na Plzeňce 1166/0, 150 00';

async function getHomepage() {
  try {
    const res = await fetch(`${API_URL}/api/homepage`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function Footer() {
  const homepage = await getHomepage();
  const phone = homepage?.contactPhone || DEFAULT_PHONE;
  const addressLines = (homepage?.contactAddress || DEFAULT_ADDRESS)
    .split(/\r?\n|,\s*/)
    .map((line: string) => line.trim())
    .filter(Boolean);

  return (
    <footer className="relative w-full bg-[#222021] pt-12 pb-14 normal-case text-white select-none shadow-[0px_-6px_52px_0px_rgba(245,245,245,0.17)]">

      <div className="absolute left-1/2 -translate-x-1/2 -top-24 w-full max-w-[1400px] h-[96px] pointer-events-none opacity-40 blur-3xl" />

      <div className="mx-auto max-w-[1245px] px-6 md:px-16">

        {/* Main layout wrapper matching the clean spacing of the target image */}
        <div className="flex flex-col gap-8">

          {/* Top Row: Brand & Contact Info */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-4">

            {/* Left side brand block */}
            <div className="flex items-center">
              <Logo className="text-white" height={48} />
            </div>

            {/* Right side contact information: Clean text sizing and layout spacing */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-14 text-lg md:text-[19px] font-normal tracking-wide text-white/90">

              {/* Phone item with exact spacing */}
              <div className="flex items-center gap-3">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-90">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>{phone}</span>
              </div>

              {/* Address item with tight line-height matching the image */}
              <div className="flex items-center gap-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-90 shrink-0">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="leading-snug">
                  {addressLines.map((line: string, i: number) => (
                    <span key={i}>
                      {i > 0 && <br />}
                      {line}
                    </span>
                  ))}
                </span>
              </div>

            </div>
          </div>

          {/* Bottom Row: Privacy Policy */}
          <div className="pt-4">
            <span className="text-sm font-light text-white/70 hover:text-white transition-colors cursor-pointer tracking-wide">
              Privacy Policy
            </span>
          </div>

        </div>
      </div>
    </footer>
  );
}
