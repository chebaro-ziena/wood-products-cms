import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { BackgroundLines } from '../components/ui/BackgroundLines';

const inter = Inter({ subsets: ['latin'], variable: '--font-body-sans' });

export const metadata: Metadata = {
  title: 'BIO CWT — Solid Wood Products',
  description: 'Solid wood products, crafted with care.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>
          <div className="relative isolate">
            {children}
            <BackgroundLines />
          </div>
        </Providers>
      </body>
    </html>
  );
}
