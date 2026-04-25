export default function InfoPage() {
  return (
    <main className="bg-brand-white text-brand-blue">
      <section className="px-6 pt-20 pb-16">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-4xl font-script text-brand-blue md:text-5xl lg:text-6xl">
            Hotel at Home
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-brand-blue/70 sm:text-lg">
            A Mediterranean-inspired boutique stay in the heart of Amadeo, Cavite
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-6xl overflow-hidden rounded-[40px] border border-brand-blue/10 bg-brand-white shadow-md shadow-brand-blue/5">
          <img
            src="/img/blue-room/blue7.jpg"
            alt="Mediterranean boutique stay"
            className="h-[420px] w-full object-cover sm:h-[520px]"
          />
        </div>
      </section>

      <section className="bg-brand-white px-6 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.28em] text-brand-blue/60">Our Story</p>
            <h2 className="mt-4 text-3xl font-semibold text-brand-blue md:text-4xl">A warm retreat shaped by local hospitality and Mediterranean charm</h2>
          </div>

          <div className="grid gap-10 lg:grid-cols-2">
            <div className="rounded-[32px] border border-brand-blue/10 bg-brand-white p-8 shadow-sm">
              <p className="text-base leading-8 text-brand-blue/70">
                Nestled in the charming town of Amadeo, Cavite, Hotel at Home was born from a dream to create a space where travelers could experience the warmth of Filipino hospitality combined with the elegance of Mediterranean design.
              </p>
              <p className="mt-6 text-base leading-8 text-brand-blue/70">
                Our boutique hotel features carefully curated rooms that blend comfort with style. Each space is designed to provide a peaceful retreat while keeping you connected to the vibrant culture and natural beauty of the region.
              </p>
            </div>

            <div className="rounded-[32px] border border-brand-blue/10 bg-brand-white p-8 shadow-sm">
              <p className="text-base leading-8 text-brand-blue/70">
                Located in Cavite’s coffee capital, we’re perfectly positioned for guests looking to explore the cooler climate and stunning views of nearby Tagaytay, while enjoying the authentic charm of a smaller town.
              </p>
              <p className="mt-6 text-base leading-8 text-brand-blue/70">
                Whether you’re here for a romantic getaway, a family vacation, or a peaceful solo retreat, Hotel at Home offers an experience that feels both luxurious and intimately personal.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-white px-6 pb-20">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-3xl font-script text-brand-blue md:text-4xl">What We Stand For</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[28px] border border-brand-blue/10 bg-brand-white p-8 shadow-sm text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-yellow text-brand-blue">
              <span className="text-2xl">♡</span>
            </div>
            <h3 className="mt-6 text-xl font-semibold text-brand-blue">Hospitality</h3>
            <p className="mt-4 text-sm leading-7 text-brand-blue/70">
              We treat every guest like family, ensuring a warm and welcoming experience.
            </p>
          </div>

          <div className="rounded-[28px] border border-brand-blue/10 bg-brand-white p-8 shadow-sm text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-yellow text-brand-blue">
              <span className="text-2xl">★</span>
            </div>
            <h3 className="mt-6 text-xl font-semibold text-brand-blue">Excellence</h3>
            <p className="mt-4 text-sm leading-7 text-brand-blue/70">
              Premium quality in every detail, from our rooms to our service.
            </p>
          </div>

          <div className="rounded-[28px] border border-brand-blue/10 bg-brand-white p-8 shadow-sm text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-yellow text-brand-blue">
              <span className="text-2xl">☺</span>
            </div>
            <h3 className="mt-6 text-xl font-semibold text-brand-blue">Community</h3>
            <p className="mt-4 text-sm leading-7 text-brand-blue/70">
              Supporting local artisans and showcasing the best of Cavite culture.
            </p>
          </div>

          <div className="rounded-[28px] border border-brand-blue/10 bg-brand-white p-8 shadow-sm text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-yellow text-brand-blue">
              <span className="text-2xl">📍</span>
            </div>
            <h3 className="mt-6 text-xl font-semibold text-brand-blue">Location</h3>
            <p className="mt-4 text-sm leading-7 text-brand-blue/70">
              Perfectly positioned for exploring Amadeo and nearby Tagaytay attractions.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-brand-white px-6 pb-20">
        <div className="mx-auto max-w-6xl rounded-[40px] border border-brand-blue/10 bg-brand-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-brand-blue/60">House Rules</p>
              <h2 className="mt-4 text-3xl font-semibold text-brand-blue md:text-4xl">A calm, comfortable stay for every guest</h2>
            </div>
            <button className="inline-flex h-11 items-center justify-center rounded-full bg-brand-yellow px-6 text-sm font-semibold text-brand-blue transition hover:bg-brand-yellow/90">
              Print Rules
            </button>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[28px] border border-brand-blue/10 bg-brand-white p-6">
              <h3 className="text-base font-semibold text-brand-blue">Check-in & Check-out</h3>
              <ul className="mt-4 space-y-3 text-sm text-brand-blue/70">
                <li>Check-in: 2:00 PM - 10:00 PM</li>
                <li>Check-out: 12:00 PM</li>
                <li>Late check-out subject to availability.</li>
              </ul>
            </div>

            <div className="rounded-[28px] border border-brand-blue/10 bg-brand-white p-6">
              <h3 className="text-base font-semibold text-brand-blue">General Rules</h3>
              <ul className="mt-4 space-y-3 text-sm text-brand-blue/70">
                <li>No smoking inside the rooms.</li>
                <li>No pets allowed.</li>
                <li>Respect quiet hours (10 PM – 7 AM).</li>
              </ul>
            </div>

            <div className="rounded-[28px] border border-brand-blue/10 bg-brand-white p-6">
              <h3 className="text-base font-semibold text-brand-blue">Cancellation Policy</h3>
              <ul className="mt-4 space-y-3 text-sm text-brand-blue/70">
                <li>Full refund if canceled up to 4 days before check-in.</li>
                <li>50% refund if canceled 3 days or less before check-in.</li>
              </ul>
            </div>

            <div className="rounded-[28px] border border-brand-blue/10 bg-brand-white p-6">
              <h3 className="text-base font-semibold text-brand-blue">Damages & Liability</h3>
              <ul className="mt-4 space-y-3 text-sm text-brand-blue/70">
                <li>Guests are responsible for any damages.</li>
                <li>Report any issues immediately to staff.</li>
                <li>Security deposit of ₱3,000 per room is required upon check-in.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
