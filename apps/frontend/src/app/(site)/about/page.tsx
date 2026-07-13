import Image from 'next/image';
import { ContactForm } from '../../../components/ContactForm';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function getHomepage() {
  try {
    const res = await fetch(`${API_URL}/api/homepage`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function AboutPage() {
  const homepage = await getHomepage();

  return (
    <div className="py-10 space-y-16">
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-display mb-4">{homepage?.aboutTitle || 'ABOUT US'}</h1>
          <p className="text-[var(--color-text-muted)]">{homepage?.aboutText || ''}</p>
        </div>
        <div className="relative aspect-video rounded-md overflow-hidden bg-[var(--color-ink-800)]">
          {homepage?.aboutImageUrl && (
            <Image src={homepage.aboutImageUrl} alt="About us" fill className="object-cover" />
          )}
        </div>
      </section>

      <ContactForm
        title={homepage?.contactTitle || 'ANY QUESTIONS?'}
        subtitle={homepage?.contactSubtitle}
      />
    </div>
  );
}
