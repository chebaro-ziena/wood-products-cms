import Image from 'next/image';

interface AboutUsProps {
  title: string;
  text: string;
  mainImage?: string;
  topImage?: string;
  bottomImage?: string;
}

const CLUSTER = { width: 424, height: 683 };
const BOXES = {
  main: { top: 106, left: 0, width: 350, height: 347 },
  top: { top: 0, left: 219, width: 205, height: 205 },
  bottom: { top: 478, left: 187, width: 205, height: 205 },
};

function pct(value: number, ref: number) {
  return `${((value / ref) * 100).toFixed(2)}%`;
}

export function AboutUs({ title, text, mainImage, topImage, bottomImage }: AboutUsProps) {
  return (
    <section
      id="about-us"
      
      className="relative ml-[calc(50%-50vw)] mr-4 sm:mr-8 lg:mr-16 max-w-[1325px] rounded-tr-[42px] rounded-br-[42px] shadow-[var(--shadow-card)] px-6 md:px-12 py-12 md:py-16"
      style={{ backgroundColor: '#1E0C06' }}
    >
      <div className="relative grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-h2 mb-15">{title}</h2>
          <p className="text-lg sm:text-xl lg:text-3xl leading-[1.39] max-w-md">
            <span className="font-bold text-white"></span>{' '}
            <span className="font-medium text-white"> {text}</span>
          </p>
        </div>

        <div className="relative aspect-[424/683] w-full max-w-[280px] mx-auto md:max-w-[350px]">
          <div
            className="absolute overflow-hidden rounded-[42px] border border-white/10 shadow-xl bg-[var(--color-ink-700)] z-20"
            style={{
              top: pct(BOXES.main.top, CLUSTER.height),
              left: pct(BOXES.main.left, CLUSTER.width),
              width: pct(BOXES.main.width, CLUSTER.width),
              height: pct(BOXES.main.height, CLUSTER.height),
            }}
          >
            {mainImage && <Image src={mainImage} alt={title} fill className="object-cover" />}
          </div>

          <div
            className="absolute overflow-hidden rounded-[42px] border border-white/10 shadow-xl bg-[var(--color-ink-700)] z-10"
            style={{
              top: pct(BOXES.top.top, CLUSTER.height),
              left: pct(BOXES.top.left, CLUSTER.width),
              width: pct(BOXES.top.width, CLUSTER.width),
              height: pct(BOXES.top.height, CLUSTER.height),
            }}
          >
            {topImage && <Image src={topImage} alt="" fill className="object-cover" />}
          </div>

          <div
            className="absolute overflow-hidden rounded-[42px] border border-white/10 shadow-xl bg-[var(--color-ink-700)] z-10"
            style={{
              top: pct(BOXES.bottom.top, CLUSTER.height),
              left: pct(BOXES.bottom.left, CLUSTER.width),
              width: pct(BOXES.bottom.width, CLUSTER.width),
              height: pct(BOXES.bottom.height, CLUSTER.height),
            }}
          >
            {bottomImage && <Image src={bottomImage} alt="" fill className="object-cover" />}
          </div>
        </div>
      </div>
    </section>
  );
}
