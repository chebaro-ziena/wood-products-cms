import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="relative mx-[calc(50%-50vw)] min-h-screen overflow-hidden bg-[var(--color-ink-900)]">
      <Image src="/404-bg.png" alt="" fill priority className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/60 via-40% to-[var(--color-ink-900)]" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pt-16 text-center">
        <h1 className="flex items-center justify-center font-title text-[6rem] sm:text-[9rem] md:text-[13rem] lg:text-[15rem] leading-none text-[var(--color-gray-100)]">
          <span>4</span>
          <span className="relative mx-1 inline-block h-[0.72em] w-[0.72em] overflow-hidden rounded-full">
            <Image src="/wood-icon.png" alt="" fill className="object-cover" />
          </span>
          <span>4</span>
        </h1>

        <h2 className="font-title !normal-case text-3xl md:text-4xl mt-2 mb-4">Woops</h2>

        <p className="mb-8 w-full max-w-md text-[var(--color-text-muted)]">
          Oh, you must be lost, there is no such page.
        </p>

        <Link href="/" className="btn-primary">
          Go to the home page
        </Link>
      </div>
    </div>
  );
}
