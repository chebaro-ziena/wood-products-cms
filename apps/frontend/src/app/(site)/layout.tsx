import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 flow-root">{children}</main>
      <Footer />
    </>
  );
}
