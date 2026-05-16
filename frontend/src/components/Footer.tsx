import Link from 'next/link';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Rooms', href: '/rooms' },
  { label: 'Info', href: '/info' },
  { label: 'Book Now', href: '/book-now' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'View Booking', href: '/view-booking' }
];

export default function Footer() {
  return (
    <footer className="bg-[#02136a] text-brand-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.32em] text-[#f9cd2a]">Quick Links</p>
            <ul className="space-y-2 text-sm text-brand-white/80">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-[#f9cd2a]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.32em] text-[#f9cd2a]">Contact Us</p>
            <ul className="space-y-3 text-sm text-brand-white/80">
              <li className="font-semibold text-brand-white">Hotel @ Home</li>
              <li>9895 Salaban, Tagaytay-Amadeo Road, Cavite</li>
              <li>
                <a href="mailto:hotelathome.ph@gmail.com" className="transition hover:text-[#f9cd2a]">
                  hotelathome.ph@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+639278584938" className="transition hover:text-[#f9cd2a]">
                  +63 927 858 4938
                </a>
              </li>
              <li>
                <a href="tel:+639178876444" className="transition hover:text-[#f9cd2a]">
                  +63 917 887 6444
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.32em] text-[#f9cd2a]">Follow Us</p>
            <div className="flex items-center gap-4 text-brand-white/80">
              <a href="https://facebook.com/HotelAtHomeAmadeo" target="_blank" rel="noopener noreferrer" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-white/20 transition hover:bg-[#f9cd2a] hover:text-brand-blue">
                <span className="sr-only">Facebook</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2.1V12h2.1V9.8c0-2.1 1.3-3.3 3.2-3.3.9 0 1.8.2 1.8.2v2h-1c-1 0-1.3.6-1.3 1.2V12h2.3l-.4 2.9h-1.9v7A10 10 0 0022 12z" />
                </svg>
              </a>
              <a href="mailto:hotelathome.ph@gmail.com" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-white/20 transition hover:bg-[#f9cd2a] hover:text-brand-blue">
                <span className="sr-only">Email</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
              </a>
              <a href="viber://chat?number=09189230346" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-white/20 transition hover:bg-[#f9cd2a] hover:text-brand-blue">
                <span className="sr-only">Viber</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-brand-white/10 pt-6 text-center text-sm text-brand-white/60">
          © 2026 Hotel at Home. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
