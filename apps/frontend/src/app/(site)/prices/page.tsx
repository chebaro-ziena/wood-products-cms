import { ContactForm } from '../../../components/ContactForm';
import { PriceList } from '../../../components/PriceList';
import type { PriceCategory } from '../../../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function getPriceList(): Promise<PriceCategory[]> {
  try {
    const res = await fetch(`${API_URL}/api/prices`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getHomepage() {
  try {
    const res = await fetch(`${API_URL}/api/homepage`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function PricesPage() {
  const [categories, homepage] = await Promise.all([getPriceList(), getHomepage()]);

  const contactTitle = homepage?.contactTitle || 'ANY QUESTIONS?';
  const contactSubtitle =
    homepage?.contactSubtitle ||
    'Write to us and we will be sure to answer all your questions and give you a comprehensive consultation.';

  return (
    <div className="py-10 space-y-16">
      <PriceList categories={categories} />

      <ContactForm title={contactTitle} subtitle={contactSubtitle} />
    </div>
  );
}
