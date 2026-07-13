'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './ui/Logo';

// Pages that use the solid dark navbar (no hero image behind them).
// Anything NOT in this list (Home "/", the 404 page, or any unmatched route)
// falls back to the transparent-over-hero-image variant.
const SOLID_BG_ROUTES = ['/gallery', '/prices', '/about', '/contact'];

const LINKS = [
  { href: '/#our-work', label: 'Gallery' },
  { href: '/prices', label: 'Prices for services' },
  { href: '/#about-us', label: 'About us' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const pathname = usePathname();
  const isSolid = SOLID_BG_ROUTES.includes(pathname);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className={
        isSolid
          ? 'relative z-50 bg-[#1E0C06] rounded-b-[79px] shadow-[0px_-8px_52px_0px_#EEEEEE2B]'
          : 'absolute top-0 left-0 right-0 z-50 bg-transparent'
      }
    >
      <div className="mx-auto max-w-6xl px-4 flex items-center justify-between py-5">
        <Link href="/" className="flex items-center gap-2 text-white" onClick={() => setMobileOpen(false)}>
          <Logo height={84} className="h-9 w-auto md:h-[84px]" />
        </Link>

        <nav className="hidden md:flex items-center gap-[57px] text-lg font-title font-bold normal-case">
          {LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isActive
                    ? 'text-[var(--color-blue-300)]'
                    : 'text-white/90 hover:text-white transition-colors'
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          className="md:hidden flex flex-col items-end justify-center gap-1.5 p-2 text-white"
        >
          <span className="block h-0.5 w-6 rounded-full bg-current" />
          <span className="block h-0.5 w-4 rounded-full bg-current" />
        </button>
      </div>

      {mobileOpen && (
        <nav className="md:hidden flex flex-col gap-4 px-6 pb-6 text-base font-title font-bold normal-case">
          {LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={
                  isActive
                    ? 'text-[var(--color-blue-300)]'
                    : 'text-white/90 hover:text-white transition-colors'
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}