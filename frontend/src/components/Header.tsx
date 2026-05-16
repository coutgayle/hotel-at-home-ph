'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Rooms', href: '/rooms' },
  { label: 'Info', href: '/info' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'View Booking', href: '/view-booking' }
];

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary-dark/10 bg-[#fefefe] shadow-lg">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 text-2xl font-semibold text-accent transition hover:text-accent/80">
          <Image
            src="/img/logo/hhlogo.png"
            alt="HH logo"
            width={74}
            height={74}
            className="h-[74px] w-[74px] object-contain"
          />
        </Link>

        <div className="flex items-center gap-8">
          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    color: isActive ? '#011478' : 'rgba(1, 20, 120, 0.44)',
                    fontWeight: isActive ? 'bold' : '500'
                  }}
                  className="text-sm transition hover:text-[#011478]"
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/book-now"
            className="hidden rounded-full px-6 py-2.5 text-sm font-semibold transition hover:bg-yellow-400 lg:inline-flex"
            style={{ backgroundColor: '#f9cd2a', color: '#011478' }}
          >
            Book Now
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-brand-blue"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-primary-dark/10 bg-[#fefefe]">
          <div className="px-6 py-4 space-y-4">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                      color: isActive ? '#011478' : 'rgba(1, 20, 120, 0.44)',
                      fontWeight: isActive ? 'bold' : '500'
                    }}
                    className="text-sm transition hover:text-[#011478]"
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <Link
              href="/book-now"
              onClick={() => setIsMenuOpen(false)}
              className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold transition hover:bg-yellow-400 w-full"
              style={{ backgroundColor: '#f9cd2a', color: '#011478' }}
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
