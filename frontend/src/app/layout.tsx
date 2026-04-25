import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Hotel at Home',
  description: 'Hotel at Home landing page with a video walkthrough, booking navigation, and availability search.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-brand-white text-brand-blue font-sans">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
