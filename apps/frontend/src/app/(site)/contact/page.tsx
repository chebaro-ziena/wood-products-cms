import { ContactForm } from '../../../components/ContactForm';

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

export default async function ContactPage() {
  const homepage = await getHomepage();

  const phone = homepage?.contactPhone || DEFAULT_PHONE;
  const address = homepage?.contactAddress || DEFAULT_ADDRESS;
  const addressLines = address
    .split(/\r?\n|,\s*/)
    .map((line: string) => line.trim())
    .filter(Boolean);

  const contactTitle = homepage?.contactTitle || 'ANY QUESTIONS?';
  const contactSubtitle =
    homepage?.contactSubtitle ||
    'Write to us and we will be sure to answer all your questions and give you a comprehensive consultation.';

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  return (
    <div className="py-10 space-y-16">
      <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-display mb-10 md:mb-14">Contact</h1>

          <div className="space-y-5 md:space-y-8 text-lg md:text-3xl leading-[1.39] font-medium text-white/90">
            <div className="flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-90 shrink-0">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>{phone}</span>
            </div>

            <div className="flex items-center gap-3">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-90 shrink-0">
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

        <div className="relative aspect-[493/428] w-full max-w-[493px] mx-auto md:mx-0 rounded-[42px] overflow-hidden border border-white/10 shadow-xl">
          <iframe
            src={mapSrc}
            className="absolute inset-0 w-full h-full"
            style={{ border: 0 }}
            loading="lazy"
            title="Map"
          />
        </div>
      </div>

      <ContactForm title={contactTitle} subtitle={contactSubtitle} />
    </div>
  );
}
