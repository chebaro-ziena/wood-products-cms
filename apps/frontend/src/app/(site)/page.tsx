import Image from 'next/image';
import { ContactForm } from '../../components/ContactForm';
import { WorkCarousel } from '../../components/WorkCarousel';
import { HomeLayout } from '../../components/home/HomeLayout';
import { Hero } from '../../components/home/Hero';
import { AboutUs } from '../../components/home/AboutUs';
import { WoodCard } from '../../components/ui/WoodCard';

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

async function getGallery() {
  try {
    const res = await fetch(`${API_URL}/api/gallery`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

const WOOD_TYPES = [
  {
    name: 'Oak',
    image: 'https://ik.imagekit.io/quhhab4ed/old-wood-grain-background%202.png?updatedAt=1783797623133',
    pros: ['Durability', 'Beautiful texture', 'Water resistance'],
    cons: ['Expensive'],
  },
  {
    name: 'Buk',
    image: 'https://ik.imagekit.io/quhhab4ed/wood-texture-design-decoration%201.png?updatedAt=1783797622583',
    pros: ['Durability'],
    cons: ['Hard to handle'],
  },
  {
    name: 'Ash',
    image: 'https://ik.imagekit.io/quhhab4ed/pale-oak-wood-texture-design-background%201.png',
    pros: ['Durability'],
    cons: ['Hard to handle'],
  },
];

const DEFAULT_ADVANTAGES = [
  'In-house carpentry production',
  'We only treat wood with environmentally friendly and safe products',
  'Prices from the manufacturer, no extra charges',
];

export default async function HomePage() {
  const [homepage, gallery] = await Promise.all([getHomepage(), getGallery()]);

  const heroTitle = homepage?.heroTitle || 'SOLID WOOD PRODUCTS';
  const heroSubtitle = homepage?.heroSubtitle || 'Oak, beech, ash from 1700 CZK per m3';
  const aboutTitle = homepage?.aboutTitle || 'ABOUT US';
  const aboutText =
    homepage?.aboutText ||
    'We manufacture solid wood products according to individual drawings. We make chairs, armchairs, wardrobes, beds and much more in our own workshop, equipped with all the necessary industrial equipment.';
  const contactTitle = homepage?.contactTitle || 'ANY QUESTIONS?';
  const contactSubtitle =
    homepage?.contactSubtitle ||
    'Write to us and we will be sure to answer all your questions and give you a comprehensive consultation.';

  const banners = (homepage?.banners || []).filter((b: any) => b.isActive && b.imageUrl);
  const heroThumbs = banners.slice(0, 3);

  const carouselImages = (gallery?.length ? gallery : [])
    .filter((g: any) => g.url)
    .map((g: any) => ({ url: g.url as string, alt: g.caption || '' }));

  const advantageImage = homepage?.advantagesImageUrl || homepage?.aboutImageUrl;
  const advantages = homepage?.advantages?.length ? homepage.advantages : DEFAULT_ADVANTAGES;

  return (
    <HomeLayout>
      
      <section className="relative -mt-16 pt-16 left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
        <Hero title={heroTitle} subtitle={heroSubtitle} thumbs={heroThumbs} />
      </section>

   {/* The wood we work with */}
<section className="px-3 py-16 sm:py-24 bg-transparent">
  <div className="max-w-7xl mx-auto flex flex-col items-center">
    
    <h2 className="font-title font-bold uppercase text-6xl sm:text-8xlxl leading-[1.2] tracking-wider text-right mb-16 lg:mb-20 text-white">
      The wood we
      <br />
      work with
    </h2>

    {/* Cards Grid: Spreads evenly and aligns perfectly centered */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 md:gap-16 lg:gap-24 w-full justify-items-center">
      {WOOD_TYPES.map((wood) => (
        <WoodCard
          key={wood.name}
          name={wood.name}
          image={wood.image}
          pros={wood.pros}
          cons={wood.cons}
        />
      ))}
    </div>
    
  </div>
</section>

      {/* SECTION 2 — Our work + advantages */}
      <section id="our-work">
        <WorkCarousel images={carouselImages} />
      </section>

     <section className="px-4 py-16 sm:py-24 max-w-5xl mx-auto flex flex-col items-center">
  {/* Heading: Centered, two lines, uppercase with custom 'W' weights */}
  <h2 className="font-title font-bold uppercase text-4xl sm:text-5xl leading-[1.2] tracking-wider text-center mb-16 lg:mb-20 text-white">
    Advantages
    <br />working with Us
  </h2>

  {/* Content Grid: Image on left, list on right */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center w-full mb-16">
    
    
    <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-[var(--color-ink-700)] w-full max-w-md mx-auto md:max-w-none">
      {advantageImage && (
        <Image 
          src={advantageImage} 
          alt="Advantages" 
          fill 
          className="object-cover" 
        />
      )}
    </div>

    
    <div className="text-left max-w-md mx-auto md:max-w-none">
      <ul className="space-y-8 md:space-y-10 text-lg md:text-xl text-neutral-300 font-medium">
        {advantages.map((item: string) => (
          <li key={item} className="leading-relaxed">
            {item}
          </li>
        ))}
      </ul>
    </div>

  </div>

 
  <div className="w-full flex justify-center">
    <a 
      href="#order" 
      className="btn-primary inline-block bg-[#748da6] text-white px-10 py-3 rounded-full text-lg hover:bg-[#637b93] transition-colors shadow-md"
    >
      Receive a consultation
    </a>
  </div>
</section>

      {/* SECTION 3 — About us + Contact */}
      <AboutUs
        title={aboutTitle}
        text={aboutText}
        mainImage={homepage?.aboutImageUrl}
        topImage={homepage?.aboutTopImageUrl}
        bottomImage={homepage?.aboutBottomImageUrl}
      />

      <ContactForm title={contactTitle} subtitle={contactSubtitle} />
    </HomeLayout>
  );
}
