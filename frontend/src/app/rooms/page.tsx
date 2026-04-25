'use client';

export default function RoomsPage() {
  return (
    <main className="bg-brand-white text-brand-blue">
      <section className="px-6 pt-20 pb-10">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-4xl font-script text-brand-blue md:text-5xl lg:text-6xl">
            Our Rooms & Spaces
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-brand-blue/70 sm:text-lg">
            Experience Mediterranean luxury in our carefully designed suites, each offering a unique blend of comfort and style.
          </p>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-7xl grid gap-8 lg:grid-cols-2">
          <GoldRoomCard />
          <BlueRoomCard />
        </div>

        <div className="mx-auto mt-10 max-w-7xl grid gap-8 lg:grid-cols-2">
          <RooftopCard />
        </div>

        <div className="mx-auto mt-16 rounded-[32px] bg-[#f3f6fb] px-8 py-12 text-center shadow-sm shadow-brand-blue/10 md:px-12">
          <h2 className="text-4xl font-script text-brand-blue md:text-5xl">
            Need Help Choosing?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-brand-blue/70 sm:text-lg">
            Our team is here to help you find the perfect accommodation for your stay. Contact us for personalized recommendations.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="tel:+639123456789"
              className="inline-flex min-w-[140px] items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-brand-blue transition hover:bg-yellow-300"
            >
              Call Us
            </a>
            <a
              href="/faqs"
              className="inline-flex min-w-[140px] items-center justify-center rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-brand-white transition hover:bg-[#001a72]"
            >
              View FAQs
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function GoldRoomCard() {
  const [currentIndex, setCurrentIndex] = require('react').useState(4);
  const totalImages = 18;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  };

  return (
    <article className="overflow-hidden rounded-[32px] border border-brand-blue/10 bg-brand-white shadow-md shadow-brand-blue/5">
      <div className="relative h-80 overflow-hidden bg-slate-100">
        <img
          key={currentIndex}
          src={`/img/gold-room/gold${currentIndex + 1}.jpg`}
          alt="Gold Room"
          className="h-full w-full object-cover"
        />
        <span className="absolute right-4 top-4 rounded-full bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand-blue shadow-sm">
          Premium Suite
        </span>
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-brand-blue/80 hover:bg-brand-blue p-2 text-brand-white transition"
          aria-label="Previous image"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-brand-blue/80 hover:bg-brand-blue p-2 text-brand-white transition"
          aria-label="Next image"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-brand-white bg-brand-blue/60 px-3 py-1 rounded-full">
          {currentIndex + 1} / {totalImages}
        </div>
      </div>
      <div className="space-y-6 p-8">
        <div>
          <h2 className="text-3xl font-semibold text-brand-blue">Gold Room</h2>
          <p className="mt-2 text-sm uppercase tracking-[0.24em] text-brand-blue/60">Price: ₱5,500/night (Weekdays) | ₱6,000 (Weekends)</p>
        </div>
        <div className="grid gap-2 text-sm text-brand-blue/70 sm:grid-cols-2">
          <div className="space-y-2">
            <p>1 King size bed</p>
            <p>1 Bathroom</p>
            <p>75 SQM</p>
            <p>Ideal for 2-3 guests</p>
            <p>Air Conditioning and WiFi</p>
          </div>
          <div className="space-y-2">
            <p>Contemporary artwork</p>
            <p>Parking Space</p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-brand-blue/10">
          <a
            href="/book-now?roomId=1"
            className="inline-flex min-w-[140px] items-center justify-center rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-brand-white transition hover:bg-[#001a72]"
          >
            Book Now
          </a>
        </div>
      </div>
    </article>
  );
}

function BlueRoomCard() {
  const [currentIndex, setCurrentIndex] = require('react').useState(7);
  const totalImages = 16;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  };

  return (
    <article className="overflow-hidden rounded-[32px] border border-brand-blue/10 bg-brand-white shadow-md shadow-brand-blue/5">
      <div className="relative h-80 overflow-hidden bg-slate-100">
        <img
          key={currentIndex}
          src={`/img/blue-room/blue${currentIndex + 1}.jpg`}
          alt="Blue Room"
          className="h-full w-full object-cover"
        />
        <span className="absolute right-4 top-4 rounded-full bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand-blue shadow-sm">
          Deluxe Suite
        </span>
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-brand-blue/80 hover:bg-brand-blue p-2 text-brand-white transition"
          aria-label="Previous image"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-brand-blue/80 hover:bg-brand-blue p-2 text-brand-white transition"
          aria-label="Next image"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-brand-white bg-brand-blue/60 px-3 py-1 rounded-full">
          {currentIndex + 1} / {totalImages}
        </div>
      </div>
      <div className="space-y-6 p-8">
        <div>
          <h2 className="text-3xl font-semibold text-brand-blue">Blue Room</h2>
          <p className="mt-2 text-sm uppercase tracking-[0.24em] text-brand-blue/60">Price: ₱5,500/night (Weekdays) | ₱6,000 (Weekends)</p>
        </div>
        <div className="grid gap-2 text-sm text-brand-blue/70 sm:grid-cols-2">
          <div className="space-y-2">
            <p>2 Queen size beds</p>
            <p>1 Bathroom</p>
            <p>Air conditioning</p>
            <p>WiFi</p>
            <p>Smart TV</p>
          </div>
          <div className="space-y-2">
            <p>Contemporary Artwork</p>
            <p>Ideal for 2-3 guests</p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-brand-blue/10">
          <a
            href="/book-now?roomId=2"
            className="inline-flex min-w-[140px] items-center justify-center rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-brand-white transition hover:bg-[#001a72]"
          >
            Book Now
          </a>
        </div>
      </div>
    </article>
  );
}

function RooftopCard() {
  const [currentIndex, setCurrentIndex] = require('react').useState(6);
  const totalImages = 17;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  };

  return (
    <article className="overflow-hidden rounded-[32px] border border-brand-blue/10 bg-brand-white shadow-md shadow-brand-blue/5">
      <div className="relative h-80 overflow-hidden bg-slate-100">
        <img
          key={currentIndex}
          src={`/img/rooftop/rooftop${currentIndex + 1}.jpg`}
          alt="Rooftop Lounge"
          className="h-full w-full object-cover"
        />
        <span className="absolute right-4 top-4 rounded-full bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand-blue shadow-sm">
          Event Space
        </span>
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-brand-blue/80 hover:bg-brand-blue p-2 text-brand-white transition"
          aria-label="Previous image"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-brand-blue/80 hover:bg-brand-blue p-2 text-brand-white transition"
          aria-label="Next image"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-brand-white bg-brand-blue/60 px-3 py-1 rounded-full">
          {currentIndex + 1} / {totalImages}
        </div>
      </div>
      <div className="space-y-6 p-8">
        <div>
          <h2 className="text-3xl font-semibold text-brand-blue">Rooftop Lounge</h2>
        </div>
        <p className="text-brand-blue/70">
          This 150SQM exclusive space is ideal for 10-15 guests, perfect for hosting late-night hangouts or slow mornings with the cool Amadeo-Tagaytay breeze.
        </p>
        <div className="grid gap-2 text-sm text-brand-blue/70 sm:grid-cols-2">
          <div className="space-y-2">
            <p>Air Conditioning</p>
            <p>WiFi</p>
            <p>Smart TV</p>
          </div>
          <div className="space-y-2">
            <p>Outdoor and Indoor seating</p>
            <p>Bar counter</p>
            <p>Dining table setup</p>
          </div>
        </div>
        <div className="pt-4">
          <button className="w-full rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-brand-white transition hover:bg-[#001a72]">
            Inquire
          </button>
        </div>
      </div>
    </article>
  );
}
