'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '../../../store/auth-store';
import { authService } from '../../../services';

const NAV = [
  { href: '/admin/dashboard', label: 'Overview' },
  { href: '/admin/dashboard/homepage', label: 'Homepage' },
  { href: '/admin/dashboard/products', label: 'Products' },
  { href: '/admin/dashboard/services', label: 'Services' },
  { href: '/admin/dashboard/gallery', label: 'Gallery' },
  { href: '/admin/dashboard/prices', label: 'Price list' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (!accessToken) {
      router.replace('/admin/login');
    }
  }, [accessToken, router]);

  if (!accessToken) return null;

  const handleLogout = async () => {
    try {
      await authService.logout();
    } finally {
      logout();
      router.replace('/admin/login');
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--color-ink-900)]">
      <aside className="w-64 shrink-0 border-r border-white/5 p-6 hidden md:block">
        <p className="font-title text-sm mb-8 text-[var(--color-clay-500)]">CMS Dashboard</p>
        <nav className="space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded-md text-sm ${
                pathname === item.href
                  ? 'bg-[var(--color-ink-700)] text-[var(--color-text-primary)]'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-ink-800)]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="mt-8 text-sm text-[var(--color-clay-500)] hover:underline"
        >
          Log out
        </button>
      </aside>
      <main className="flex-1 p-8 max-w-5xl">{children}</main>
    </div>
  );
}
