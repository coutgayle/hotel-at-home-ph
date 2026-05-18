﻿'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ViewBookingPage() {
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState<any>(null);
  const router = useRouter();

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !email.trim()) return;

    setIsLoading(true);
    setError('');
    setBooking(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/api/bookings/${code.trim().toUpperCase()}?email=${encodeURIComponent(email.trim())}`);
      const data = await response.json();

      if (response.ok) {
        setBooking(data);
      } else {
        setError(data.error || 'Booking not found. Please check your confirmation code and email address.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoomName = (roomId: number) => {
    switch (roomId) {
      case 1: return 'Gold Room';
      case 2: return 'Blue Room';
      case 3: return 'Rooftop Lounge';
      default: return 'Unknown Room';
    }
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '--';
    const [y, m, d] = String(dateStr).split('T')[0].split('-');
    const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <main className="min-h-screen bg-[#f3f6fb] text-brand-blue pb-20 pt-12 sm:pt-24 px-6 relative">
      <div className="mx-auto max-w-7xl relative">
        <button 
          onClick={() => router.back()} 
          className="absolute left-0 top-0 hidden sm:flex items-center gap-2 text-sm font-semibold text-brand-blue/70 hover:text-brand-blue transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          Back
        </button>
      </div>

      <div className="mx-auto max-w-xl mt-2 sm:mt-0">
        <div className="mb-8 sm:hidden">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-semibold text-brand-blue/70 hover:text-brand-blue transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            Back
          </button>
        </div>
        <div className="text-center mb-10">
          <h1 className="text-4xl font-script text-brand-blue md:text-5xl">View Booking Status</h1>
          <p className="mt-3 text-brand-blue/70">Enter your confirmation code and email below to view your details.</p>
        </div>

        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-brand-blue/5">
          <form onSubmit={handleLookup} className="space-y-4">
            <div>
              <input 
                type="text" 
                placeholder="Confirmation Code (e.g. HH-ABC123)" 
                value={code} 
                onChange={(e) => setCode(e.target.value)} 
                className="w-full rounded-xl border border-brand-blue/10 bg-[#f3f6fb] px-6 py-4 outline-none focus:border-brand-blue transition text-center text-lg uppercase tracking-widest font-semibold placeholder:font-normal placeholder:tracking-normal" 
                required
              />
            </div>
            <div>
              <input 
                type="email" 
                placeholder="Email address used for booking" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full rounded-xl border border-brand-blue/10 bg-[#f3f6fb] px-6 py-4 outline-none focus:border-brand-blue transition text-center text-base placeholder:text-brand-blue/50" 
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button 
              type="submit" 
              disabled={isLoading || !code.trim() || !email.trim()} 
              className="w-full rounded-full bg-brand-blue px-6 py-4 font-semibold text-white transition hover:bg-[#001a72] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Searching...' : 'Check Status'}
            </button>
          </form>
        </div>

        {booking && (
          <div className="mt-8 bg-white rounded-[32px] p-8 shadow-sm border border-brand-blue/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-start mb-6 border-b border-brand-blue/10 pb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-blue/50 mb-1">Reservation Code</p>
                <p className="text-2xl font-bold tracking-widest">{booking.confirmation_code}</p>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                booking.status.toLowerCase() === 'confirmed' ? 'bg-green-100 text-green-700' : 
                booking.status.toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-700' : 
                'bg-yellow-100 text-yellow-700'
              }`}>
                {booking.status}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 text-sm">
              <div><p className="text-xs uppercase tracking-wider text-brand-blue/50 mb-1">Guest Name</p><p className="font-medium">{booking.guest_first_name} {booking.guest_last_name}</p></div>
              <div><p className="text-xs uppercase tracking-wider text-brand-blue/50 mb-1">Room / Space</p><p className="font-medium">{getRoomName(booking.room_id)}</p></div>
              <div><p className="text-xs uppercase tracking-wider text-brand-blue/50 mb-1">Check-in</p><p className="font-medium">{formatDisplayDate(booking.check_in)}</p></div>
              <div><p className="text-xs uppercase tracking-wider text-brand-blue/50 mb-1">Check-out</p><p className="font-medium">{formatDisplayDate(booking.check_out)}</p></div>
              
              {booking.room_id === 3 ? (
                <div className="sm:col-span-2"><p className="text-xs uppercase tracking-wider text-brand-blue/50 mb-1">Event Purpose & Details</p><p className="font-medium whitespace-pre-wrap">{booking.purpose || 'N/A'}</p></div>
              ) : (
                <div className="sm:col-span-2"><p className="text-xs uppercase tracking-wider text-brand-blue/50 mb-1">Total Price</p><p className="font-medium text-lg text-accent tracking-wider">₱{parseFloat(booking.total_price).toLocaleString()}</p></div>
              )}
            </div>
          </div>
        )}
        
        <div className="mt-8 text-center">
           <Link href="/" className="text-sm font-semibold text-brand-blue/70 hover:text-brand-blue transition underline">Return to Home</Link>
        </div>
      </div>
    </main>
  );
}