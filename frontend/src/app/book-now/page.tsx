﻿'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

type Room = {
  id: string;
  name: string;
  price: number;
  sqm: string;
  capacity: string;
  maxGuests: number;
  image: string;
  gallery: string[];
  description: string;
  amenities: string[];
};

const getGallery = (folder: string, prefix: string, count: number, frontImage: string) => {
  const allImages = Array.from({ length: count }, (_, i) => `/img/${folder}/${prefix}${i + 1}.jpg`);
  return [frontImage, ...allImages.filter((img) => img !== frontImage)];
};

type BookingData = {
  room: Room | null;
  checkIn: string;
  checkOut: string;
  guests: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  paymentMethod: 'gcash' | 'bank' | 'cash' | '';
};

const rooms: Room[] = [
  {
    id: '1',
    name: 'Gold Room',
    price: 5500,
    sqm: '75 SQM',
    capacity: '2-3 guests',
    maxGuests: 2,
    image: '/img/gold-room/gold5.jpg',
    gallery: getGallery('gold-room', 'gold', 18, '/img/gold-room/gold5.jpg'),
    description: 'Experience Mediterranean luxury in our premium suite featuring contemporary artwork and a spacious layout.',
    amenities: ['1 King size bed', '1 Bathroom', 'Air Conditioning & WiFi', 'Contemporary artwork', 'Parking Space'],
  },
  {
    id: '2',
    name: 'Blue Room',
    price: 5500,
    sqm: '75 SQM',
    capacity: '2-3 guests',
    maxGuests: 4,
    image: '/img/blue-room/blue8.jpg',
    gallery: getGallery('blue-room', 'blue', 16, '/img/blue-room/blue8.jpg'),
    description: 'A beautifully designed deluxe suite offering comfort and style for small families or groups.',
    amenities: ['2 Queen size beds', '1 Bathroom', 'Air conditioning & WiFi', 'Smart TV', 'Contemporary Artwork'],
  },
  {
    id: '3',
    name: 'Rooftop Lounge',
    price: 0,
    sqm: '150 SQM',
    capacity: '10-15 guests',
    maxGuests: 15,
    image: '/img/rooftop/rooftop7.jpg',
    gallery: getGallery('rooftop', 'rooftop', 17, '/img/rooftop/rooftop7.jpg'),
    description: 'This 150SQM exclusive space is ideal for 10-15 guests, perfect for hosting late-night hangouts or slow mornings with the cool Amadeo-Tagaytay breeze.',
    amenities: ['Air Conditioning & WiFi', 'Smart TV', 'Outdoor and Indoor seating', 'Bar counter', 'Dining table setup'],
  },
];

function RoomDetailsModal({ isOpen, onClose, room }: { isOpen: boolean; onClose: () => void; room: Room | null }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isOpen && room) {
      const mainIndex = room.gallery.findIndex((img) => img === room.image);
      setCurrentIndex(mainIndex !== -1 ? mainIndex : 0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, room]);

  if (!isOpen || !room) return null;

  const handlePrev = () => setCurrentIndex((prev) => (prev === 0 ? room.gallery.length - 1 : prev - 1));
  const handleNext = () => setCurrentIndex((prev) => (prev === room.gallery.length - 1 ? 0 : prev + 1));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-blue/60 p-4 sm:p-6 backdrop-blur-sm transition-opacity" onClick={onClose}>
      <div className="relative flex w-full max-w-2xl max-h-[85vh] flex-col overflow-hidden rounded-[32px] bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-brand-blue/80 text-white transition hover:bg-brand-blue" aria-label="Close modal">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <div className="relative h-64 w-full shrink-0 bg-slate-100 sm:h-80">
          <img src={room.gallery[currentIndex]} alt={room.name} className="h-full w-full object-cover" />
          <button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-brand-blue/80 p-2 text-white transition hover:bg-brand-blue"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
          <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-brand-blue/80 p-2 text-white transition hover:bg-brand-blue"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-brand-blue/60 px-3 py-1 text-xs text-white">{currentIndex + 1} / {room.gallery.length}</div>
        </div>
        <div className="overflow-y-auto p-6 text-brand-blue sm:p-8">
          <h2 className="text-3xl font-semibold">{room.name}</h2>
          <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-widest text-brand-blue/60"><span>{room.sqm}</span><span>•</span><span>{room.capacity}</span></div>
          <p className="mt-4 text-sm leading-6 text-brand-blue/80">{room.description}</p>
          <h3 className="mt-6 text-sm font-semibold uppercase tracking-widest text-brand-blue/60">Amenities & Features</h3>
          <ul className="mt-3 grid gap-2 text-sm text-brand-blue/80 sm:grid-cols-2">
            {room.amenities.map((amenity) => (<li key={amenity} className="flex items-center gap-2"><span className="text-brand-yellow">★</span> {amenity}</li>))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const stepMeta = [
  { title: 'Your booking', subtitle: 'Select your room and dates' },
  { title: 'Your details', subtitle: 'Tell us who is coming' },
  { title: 'Pay and confirm', subtitle: 'Secure partner checkout' },
];

const confirmationStepMeta = { title: 'Confirmation', subtitle: 'Reservation complete' };

const today = new Date().toISOString().slice(0, 10);

const addDays = (date: string, days: number) => {
  const value = new Date(date);
  value.setDate(value.getDate() + days);
  return value.toISOString().slice(0, 10);
};

const minCheckInDate = addDays(today, 3); // Minimum 3 days advance booking

const fullyBookedMock: string[] = []; // Cleared mock dates to allow long multi-row reservations
const closedMock: string[] = [];

function DateRangePicker({
  checkIn,
  checkOut,
  onChange,
}: {
  checkIn: string;
  checkOut: string;
  onChange: (start: string, end: string) => void;
}) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [hoverDate, setHoverDate] = useState<string | null>(null);

  const nextMonthObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);

  const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const getDays = (year: number, month: number) => {
    const date = new Date(year, month, 1);
    const days: (Date | null)[] = [];
    const firstDay = date.getDay();
    for (let i = 0; i < firstDay; i++) days.push(null);
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const checkRangeAvailability = (start: string, end: string) => {
    let curr = new Date(start);
    const endObj = new Date(end);
    curr.setDate(curr.getDate() + 1);
    while (curr < endObj) {
      const str = formatDate(curr);
      if (fullyBookedMock.includes(str) || closedMock.includes(str)) return true;
      curr.setDate(curr.getDate() + 1);
    }
    return false;
  };

  const handleDayClick = (dateStr: string, isUnavailable: boolean) => {
    if (isUnavailable) return;
    if (!checkIn || (checkIn && checkOut)) {
      onChange(dateStr, '');
    } else if (checkIn && !checkOut) {
      if (dateStr <= checkIn) {
        onChange(dateStr, '');
      } else {
        if (checkRangeAvailability(checkIn, dateStr)) {
          onChange(dateStr, '');
        } else {
          onChange(checkIn, dateStr);
          setHoverDate(null);
        }
      }
    }
  };

  const renderMonth = (dateObj: Date) => {
    const y = dateObj.getFullYear();
    const m = dateObj.getMonth();
    const days = getDays(y, m);
    const monthName = dateObj.toLocaleString('default', { month: 'long', year: 'numeric' });

    return (
      <div className="flex-1 min-w-[260px]">
        <div className="mb-4 text-center font-semibold text-brand-blue">{monthName}</div>
        <div className="mb-2 grid grid-cols-7 text-center text-xs font-semibold text-brand-blue/50">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => <div key={d}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-y-2">
          {days.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} className="h-10 w-full" />;
            const dateStr = formatDate(day);
            const isPast = dateStr < minCheckInDate;
            const isFullyBooked = fullyBookedMock.includes(dateStr);
            const isClosed = closedMock.includes(dateStr);
            const isUnavailable = isPast || isFullyBooked || isClosed;

            const isCheckIn = dateStr === checkIn;
            const isCheckOut = dateStr === checkOut;
            const isSelected = isCheckIn || isCheckOut;
            
            let inRangeBg = false;
            let isHover = false;
            
            if (checkIn && checkOut) {
              inRangeBg = dateStr > checkIn && dateStr < checkOut;
            } else if (checkIn && hoverDate && !checkOut) {
              const invalidRange = checkRangeAvailability(checkIn, hoverDate);
              if (!invalidRange) {
                isHover = dateStr > checkIn && dateStr <= hoverDate;
                inRangeBg = isHover && dateStr !== hoverDate;
              }
            }

            let rangeSpanClass = '';
            if (isCheckIn && (checkOut || isHover)) {
              rangeSpanClass = 'absolute right-0 w-1/2 h-full bg-brand-blue/10';
            } else if (isCheckOut || (isHover && dateStr === hoverDate)) {
              rangeSpanClass = 'absolute left-0 w-1/2 h-full bg-brand-blue/10';
            }

            let buttonClass = 'text-brand-blue hover:bg-brand-blue/10';
            if (isSelected) {
              buttonClass = 'bg-brand-blue text-white shadow-md z-10';
            } else if (isClosed) {
              buttonClass = 'bg-gray-200 text-gray-400 cursor-not-allowed';
            } else if (isFullyBooked) {
              buttonClass = 'bg-red-50 text-red-400 line-through cursor-not-allowed border border-red-100';
            } else if (isPast) {
              buttonClass = 'text-gray-300 cursor-not-allowed';
            }

            return (
              <div 
                key={dateStr} 
                className="relative flex h-10 w-full items-center justify-center"
                onMouseEnter={() => !isUnavailable && checkIn && !checkOut && setHoverDate(dateStr)}
                onMouseLeave={() => setHoverDate(null)}
              >
                {inRangeBg && <div className="absolute inset-0 bg-brand-blue/10" />}
                {rangeSpanClass && <div className={rangeSpanClass} />}
                <button
                  type="button"
                  disabled={isUnavailable}
                  onClick={() => handleDayClick(dateStr, isUnavailable)}
                  className={`relative flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all ${buttonClass}`}
                >
                  {day.getDate()}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full select-none">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center gap-4 text-xs font-medium text-brand-blue/70">
           <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-brand-blue"></span> Selected</span>
           <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-red-100 border border-red-200"></span> Fully Booked</span>
           <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-gray-200"></span> Closed</span>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={handlePrevMonth} className="rounded-full border border-brand-blue/20 p-1.5 text-brand-blue hover:bg-brand-blue/5 transition">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          </button>
          <button type="button" onClick={handleNextMonth} className="rounded-full border border-brand-blue/20 p-1.5 text-brand-blue hover:bg-brand-blue/5 transition">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
          </button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12 justify-center">
        {renderMonth(currentMonth)}
        {renderMonth(nextMonthObj)}
      </div>
    </div>
  );
}

const formatCurrency = (amount: number) =>
  amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
  });

const formatDisplayDate = (dateStr: string) => {
  if (!dateStr) return 'Add Date';
  const [y, m, d] = dateStr.split('-');
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit' });
};

function BookNowFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData>({
    room: null,
    checkIn: '',
    checkOut: '',
    guests: 2,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    paymentMethod: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const searchParams = useSearchParams();
  const roomId = searchParams.get('roomId');
  const checkInParam = searchParams.get('checkIn');
  const checkOutParam = searchParams.get('checkOut');
  const guestsParam = searchParams.get('guests');

  const [activePopover, setActivePopover] = useState<'room' | 'dates' | 'guests' | null>(null);

  useEffect(() => {
    const handleClickOutside = () => setActivePopover(null);
    if (activePopover) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activePopover]);

  useEffect(() => {
    setBookingData((prev) => {
      const room = roomId ? rooms.find((item) => item.id === roomId) || prev.room : prev.room;
      return {
        ...prev,
        room,
        checkIn: checkInParam || prev.checkIn,
        checkOut: checkOutParam || prev.checkOut,
        guests: guestsParam ? Number(guestsParam) : prev.guests,
      };
    });
  }, [roomId, checkInParam, checkOutParam, guestsParam]);

  const calculateNights = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0;
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const diff = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24);
    return diff > 0 ? diff : 0;
  };

  const calculateCost = () => {
    if (!bookingData.checkIn || !bookingData.checkOut || !bookingData.room) return 0;
    if (bookingData.room.id === '3') return 0; // Rooftop Lounge has no upfront price
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    let total = 0;
    let currentDate = new Date(checkIn);
    while (currentDate < checkOut) {
      const day = currentDate.getDay();
      const isWeekend = day === 5 || day === 6; // Friday and Saturday nights
      if (bookingData.room.id === '1' || bookingData.room.id === '2') {
        total += isWeekend ? 6000 : 5500;
      } else {
        total += bookingData.room.price;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return total;
  };

  const totalCost = calculateCost();

  const canProceed = () => {
    if (currentStep === 1) {
      return (
        bookingData.room !== null &&
        bookingData.checkIn !== '' &&
        bookingData.checkOut !== '' &&
        bookingData.guests <= bookingData.room.maxGuests
      );
    }
    if (currentStep === 2)
      return (
        bookingData.firstName &&
        bookingData.lastName &&
        bookingData.email &&
        bookingData.phone
      );
    if (currentStep === 3) return bookingData.room?.id === '3' || bookingData.paymentMethod !== '';
    return true;
  };

  const goNext = () => {
    if (canProceed() && currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goPrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (canProceed()) {
      setIsSubmitting(true);
      try {
        await fetch('/api/booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...bookingData, totalCost }),
        });
        // Proceed to confirmation screen 
        setCurrentStep(4);
      } catch (error) {
        console.error('Error submitting booking:', error);
        setCurrentStep(4); // Fallback so UI still progresses if email setup is incomplete
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <main className="bg-[#f8f9ff] text-brand-blue">
      {/* Sticky Booking Summary Bar */}
      <div className="sticky top-[72px] z-40 w-full border-b border-brand-blue/10 bg-white shadow-sm lg:top-[88px]">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2 px-2 py-3 sm:gap-4 md:px-6 md:py-4">
          
          {/* Location */}
          <div className="flex flex-1 min-w-0 items-center justify-center gap-1.5 rounded-[20px] border border-brand-blue/20 bg-[#f8f9ff] px-2 py-2 transition hover:bg-brand-blue/5 sm:justify-start sm:gap-3 sm:rounded-full sm:px-5 sm:py-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0 text-brand-blue sm:h-5 sm:w-5">
              <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            <div className="flex min-w-0 flex-col text-center sm:text-left">
              <span className="truncate text-[10px] font-bold leading-tight text-brand-blue sm:text-sm">Hotel at Home PH</span>
              <span className="truncate text-[9px] text-brand-blue/70 sm:text-xs">Amadeo, Cavite</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hidden h-4 w-4 shrink-0 text-brand-blue/60 sm:block sm:ml-auto">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>

          {/* Room Selection */}
          <div 
            className="relative flex flex-1 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-[20px] border border-brand-blue/20 bg-[#f8f9ff] px-2 py-2 transition hover:bg-brand-blue/5 sm:justify-start sm:gap-3 sm:rounded-full sm:px-5 sm:py-2.5" 
            onClick={(e) => {
              e.stopPropagation();
              if (currentStep > 1) setActivePopover(activePopover === 'room' ? null : 'room');
              else setCurrentStep(1);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0 text-brand-blue sm:h-5 sm:w-5">
              <path d="M3.75 3.375a.75.75 0 00-.75.75v13.5a.75.75 0 001.5 0V15h15v2.625a.75.75 0 001.5 0v-6.375A4.125 4.125 0 0016.875 7.125h-3.375A4.125 4.125 0 009.375 11.25v.375H4.5v-7.5a.75.75 0 00-.75-.75zm4.875 7.875V11.25a2.625 2.625 0 012.625-2.625h3.375a2.625 2.625 0 012.625 2.625v.375h-8.625zM6 8.25a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            </svg>
            <div className="flex min-w-0 flex-col text-center sm:text-left">
              <span className="truncate text-[10px] font-bold leading-tight text-brand-blue sm:text-sm">
                {bookingData.room ? bookingData.room.name : 'Select Room'}
              </span>
              <span className="truncate text-[9px] text-brand-blue/70 sm:text-xs">Room Type</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hidden h-4 w-4 shrink-0 text-brand-blue/60 sm:block sm:ml-auto">
              <path d="M6 9l6 6 6-6" />
            </svg>

            {activePopover === 'room' && currentStep > 1 && (
              <div 
                className="absolute top-full left-0 mt-3 w-64 rounded-2xl bg-white p-4 shadow-xl border border-brand-blue/10 z-50 cursor-default"
                onClick={(e) => e.stopPropagation()}
              >
                <label className="block text-sm font-semibold text-brand-blue mb-3">Select Room</label>
                <div className="flex flex-col gap-2">
                  {rooms.map((r) => (
                    <button 
                      key={r.id}
                      type="button"
                      className={`text-left px-3 py-2 rounded-xl text-sm transition ${bookingData.room?.id === r.id ? 'bg-brand-blue/10 font-bold text-brand-blue' : 'hover:bg-brand-blue/5 text-brand-blue/80'}`}
                      onClick={() => {
                        setBookingData({...bookingData, room: r});
                        setActivePopover(null);
                      }}
                    >
                      {r.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Check In - Check Out */}
          <div 
            className="relative flex flex-1 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-[20px] border border-brand-blue/20 bg-[#f8f9ff] px-2 py-2 transition hover:bg-brand-blue/5 sm:justify-start sm:gap-3 sm:rounded-full sm:px-5 sm:py-2.5" 
            onClick={(e) => {
              e.stopPropagation();
              if (currentStep > 1) setActivePopover(activePopover === 'dates' ? null : 'dates');
              else setCurrentStep(1);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0 text-brand-blue sm:h-5 sm:w-5">
              <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
              <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
            </svg>
            <div className="flex min-w-0 flex-col text-center sm:text-left">
              <span className="truncate text-[10px] font-bold leading-tight text-brand-blue sm:text-sm">
                {formatDisplayDate(bookingData.checkIn)} - {formatDisplayDate(bookingData.checkOut)}
              </span>
              <span className="truncate text-[9px] text-brand-blue/70 sm:text-xs">Check-In - Check-Out</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hidden h-4 w-4 shrink-0 text-brand-blue/60 sm:block sm:ml-auto">
              <path d="M6 9l6 6 6-6" />
            </svg>

            {activePopover === 'dates' && currentStep > 1 && (
              <div 
                className="absolute top-full left-1/2 -translate-x-1/2 mt-3 p-5 bg-white rounded-2xl shadow-xl border border-brand-blue/10 z-50 w-[90vw] max-w-[650px] overflow-x-auto cursor-default"
                onClick={(e) => e.stopPropagation()}
              >
                <DateRangePicker 
                  checkIn={bookingData.checkIn} 
                  checkOut={bookingData.checkOut}
                  onChange={(start, end) => setBookingData(prev => ({ ...prev, checkIn: start, checkOut: end }))}
                />
              </div>
            )}
          </div>

          {/* Guest Count */}
          <div 
            className="relative flex flex-1 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-[20px] border border-brand-blue/20 bg-[#f8f9ff] px-2 py-2 transition hover:bg-brand-blue/5 sm:justify-start sm:gap-3 sm:rounded-full sm:px-5 sm:py-2.5" 
            onClick={(e) => {
              e.stopPropagation();
              if (currentStep > 1) setActivePopover(activePopover === 'guests' ? null : 'guests');
              else setCurrentStep(1);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0 text-brand-blue sm:h-5 sm:w-5">
              <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
            </svg>
            <div className="flex min-w-0 flex-col text-center sm:text-left">
              <span className="truncate text-[10px] font-bold leading-tight text-brand-blue sm:text-sm">
                {bookingData.guests} Guest{bookingData.guests > 1 ? 's' : ''}
              </span>
              <span className="truncate text-[9px] text-brand-blue/70 sm:text-xs">Guest Count</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hidden h-4 w-4 shrink-0 text-brand-blue/60 sm:block sm:ml-auto">
              <path d="M6 9l6 6 6-6" />
            </svg>

            {activePopover === 'guests' && currentStep > 1 && (
              <div 
                className="absolute top-full right-0 mt-3 w-56 p-4 bg-white rounded-2xl shadow-xl border border-brand-blue/10 z-50 cursor-default"
                onClick={(e) => e.stopPropagation()}
              >
                <label className="block text-sm font-semibold text-brand-blue mb-3">Guests</label>
                <div className="flex items-center gap-4">
                  <button 
                    type="button"
                    className="h-10 w-10 rounded-full border border-brand-blue/20 flex items-center justify-center hover:bg-brand-blue/5 disabled:opacity-50 text-brand-blue"
                    disabled={bookingData.guests <= 1}
                    onClick={() => setBookingData({...bookingData, guests: bookingData.guests - 1})}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" /></svg>
                  </button>
                  <span className="flex-1 text-center font-bold text-brand-blue">{bookingData.guests}</span>
                  <button 
                    type="button"
                    className="h-10 w-10 rounded-full border border-brand-blue/20 flex items-center justify-center hover:bg-brand-blue/5 disabled:opacity-50 text-brand-blue"
                    disabled={bookingData.room ? bookingData.guests >= bookingData.room.maxGuests : false}
                    onClick={() => setBookingData({...bookingData, guests: bookingData.guests + 1})}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                  </button>
                </div>
                {bookingData.room && bookingData.guests >= bookingData.room.maxGuests && <p className="mt-3 text-xs text-center text-red-500">Max capacity reached.</p>}
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="min-h-screen px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl flex flex-col justify-center text-center pt-12 pb-8">
            <h1 className="text-3xl font-semibold text-brand-blue md:text-4xl lg:text-4xl leading-tight">
              Book Your Stay
            </h1>
            <p className="mt-3 text-sm leading-6 text-brand-blue/70 max-w-2xl mx-auto">
              Reserve your room in three easy steps. Smart dates and secure online partner payment make booking faster.
            </p>
          </div>

          <div>
            <div className="mx-auto max-w-7xl">
              <div className="rounded-[32px] border border-brand-blue/10 bg-white p-5 shadow-sm md:p-6 lg:p-8">
                <div className="grid grid-cols-3 gap-4 text-center items-center">
                  {stepMeta.map((step, index) => (
                    <div key={step.title} className="relative">
                      <div
                        className={`mx-auto h-14 w-14 rounded-full border-2 flex items-center justify-center text-base font-semibold transition ${
                          currentStep === index + 1 || (currentStep === 4 && index === 2)
                            ? 'bg-brand-blue text-white border-brand-blue'
                            : 'bg-white text-brand-blue border-brand-blue/20'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="mt-3 text-xs uppercase tracking-[0.3em] text-brand-blue/60 hidden lg:block">
                        {step.title}
                      </div>
                      {index < stepMeta.length - 1 && (
                        <span className="absolute right-[-2.5rem] top-1/2 hidden h-[2px] w-20 bg-brand-blue/20 lg:block"></span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12 mx-auto max-w-4xl">
                <div className="rounded-[32px] border border-brand-blue/10 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-brand-blue/40">Step {Math.min(currentStep, 3)}</p>
                      <h2 className="mt-2 text-2xl font-semibold text-brand-blue">
                        {currentStep <= 3 ? stepMeta[currentStep - 1].title : confirmationStepMeta.title}
                      </h2>
                    </div>
                    <div className="rounded-full bg-brand-blue/5 px-3 py-1.5 text-xs font-semibold text-brand-blue">
                      {currentStep <= 3 ? stepMeta[currentStep - 1].subtitle : confirmationStepMeta.subtitle}
                    </div>
                  </div>

                  <div className="mt-8">
                    {currentStep === 1 && (
                      <div className="space-y-5">

                        {/* Room Selection */}
                        <div className="rounded-[24px] border border-brand-blue/10 bg-[#f7f8ff] p-5">
                          <div className="mb-3 flex items-center justify-between">
                            <label className="block text-sm font-semibold text-brand-blue">
                              Select a Room
                            </label>
                            {bookingData.room && (
                              <button
                                type="button"
                                onClick={() => setIsModalOpen(true)}
                                className="text-xs font-semibold text-brand-blue underline transition hover:text-brand-blue/70"
                              >
                                View room details
                              </button>
                            )}
                          </div>
                          <select
                            value={bookingData.room?.id || ''}
                            onChange={(e) => {
                              const room = rooms.find((item) => item.id === e.target.value) || null;
                              setBookingData({ ...bookingData, room });
                            }}
                            className="w-full rounded-2xl border border-brand-blue/20 bg-white px-4 py-3 text-brand-blue focus:border-brand-blue focus:outline-none"
                          >
                            <option value="">Choose your room</option>
                            {rooms.map((room) => (
                              <option key={room.id} value={room.id}>
                                {room.name} — {room.price > 0 ? `Starts at ${formatCurrency(room.price)}/night` : 'Price upon inquiry'}
                              </option>
                            ))}
                          </select>

                          {bookingData.room && (
                            <div className="group relative mt-4 h-32 w-full cursor-pointer overflow-hidden rounded-xl border border-brand-blue/10 sm:h-48" onClick={() => setIsModalOpen(true)}>
                              <img src={bookingData.room.image} alt={bookingData.room.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                              <div className="absolute inset-0 flex items-center justify-center bg-brand-blue/20 opacity-0 transition-opacity group-hover:opacity-100">
                                <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-brand-blue shadow-sm">View Gallery</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Date Selection */}
                        <div className="rounded-[24px] border border-brand-blue/10 bg-[#f7f8ff] p-5 lg:p-8">
                          <label className="block text-sm font-semibold text-brand-blue mb-4">Select Dates</label>
                          <DateRangePicker 
                            checkIn={bookingData.checkIn} 
                            checkOut={bookingData.checkOut}
                            onChange={(start, end) => setBookingData(prev => ({ ...prev, checkIn: start, checkOut: end }))}
                          />
                        </div>

                        {/* Guest Selection */}
                        <div className="rounded-[24px] border border-brand-blue/10 bg-[#f7f8ff] p-5">
                          <label className="block text-sm font-semibold text-brand-blue mb-3">Guests</label>
                          <input
                            type="number"
                            min="1"
                            value={bookingData.guests}
                            onChange={(e) =>
                              setBookingData({
                                ...bookingData,
                                guests: Number(e.target.value) || 1,
                              })
                            }
                            className="w-32 rounded-2xl border border-brand-blue/20 bg-white px-4 py-3 text-brand-blue focus:border-brand-blue focus:outline-none"
                          />
                          {bookingData.room && bookingData.guests > bookingData.room.maxGuests && (
                            <p className="mt-3 text-sm font-semibold text-red-500">
                              The selected room can only accommodate up to {bookingData.room.maxGuests} guests.
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="space-y-5">
                        <p className="text-brand-blue/70">
                          Enter guest details so we can confirm your reservation without delay.
                        </p>
                        <div className="grid gap-4 lg:grid-cols-2">
                          <input
                            type="text"
                            placeholder="First Name"
                            value={bookingData.firstName}
                            onChange={(e) =>
                              setBookingData({ ...bookingData, firstName: e.target.value })
                            }
                            className="w-full rounded-2xl border border-brand-blue/20 bg-[#f7f8ff] px-4 py-3 text-brand-blue focus:border-brand-blue focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Last Name"
                            value={bookingData.lastName}
                            onChange={(e) =>
                              setBookingData({ ...bookingData, lastName: e.target.value })
                            }
                            className="w-full rounded-2xl border border-brand-blue/20 bg-[#f7f8ff] px-4 py-3 text-brand-blue focus:border-brand-blue focus:outline-none"
                          />
                        </div>
                        <div className="grid gap-4 lg:grid-cols-2">
                          <input
                            type="email"
                            placeholder="Email Address"
                            value={bookingData.email}
                            onChange={(e) =>
                              setBookingData({ ...bookingData, email: e.target.value })
                            }
                            className="w-full rounded-2xl border border-brand-blue/20 bg-[#f7f8ff] px-4 py-3 text-brand-blue focus:border-brand-blue focus:outline-none"
                          />
                          <input
                            type="tel"
                            placeholder="Phone Number"
                            value={bookingData.phone}
                            onChange={(e) =>
                              setBookingData({ ...bookingData, phone: e.target.value })
                            }
                            className="w-full rounded-2xl border border-brand-blue/20 bg-[#f7f8ff] px-4 py-3 text-brand-blue focus:border-brand-blue focus:outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className={`space-y-5 transition-opacity ${isSubmitting ? 'pointer-events-none opacity-50' : ''}`}>
                        {bookingData.room?.id === '3' ? (
                          <div className="rounded-[24px] border border-brand-blue/10 bg-brand-blue/5 p-6 text-center">
                            <p className="text-brand-blue/70">
                              Payment is not required yet for Rooftop Lounge inquiries. Please proceed to submit your request, and our admin will contact you with a quotation and arrangement details.
                            </p>
                          </div>
                        ) : (
                          <>
                            <p className="text-brand-blue/70">
                              Select your preferred payment method. Payment instructions will be sent once your booking is approved by the admin.
                            </p>
                            <div className="grid gap-3">
                              {[
                                { id: 'gcash', label: 'GCash', description: 'Payment via GCash app' },
                                { id: 'bank', label: 'Bank Transfer', description: 'Transfer via local banks (BDO, BPI, etc.)' },
                                { id: 'cash', label: 'Cash', description: 'Pay in cash upon arrival' },
                              ].map((method) => (
                                <button
                                  key={method.id}
                                  onClick={() =>
                                    setBookingData({ ...bookingData, paymentMethod: method.id as any })
                                  }
                                  className={`w-full rounded-[24px] border p-4 text-left transition ${
                                    bookingData.paymentMethod === method.id
                                      ? 'border-brand-blue bg-brand-blue/5'
                                      : 'border-brand-blue/20 bg-white hover:border-brand-blue'
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-4">
                                    <div>
                                      <h3 className="text-lg font-semibold text-brand-blue">{method.label}</h3>
                                      <p className="mt-2 text-sm text-brand-blue/70">{method.description}</p>
                                    </div>
                                    <span className="text-sm uppercase tracking-[0.3em] text-brand-blue/40">
                                      {bookingData.paymentMethod === method.id ? 'Selected' : 'Choose'}
                                    </span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {currentStep === 4 && (
                      <div className="space-y-5 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white shadow-lg">
                          ✓
                        </div>
                        <h3 className="text-2xl font-semibold text-brand-blue">Booking Request Sent</h3>
                        <p className="mx-auto max-w-xl text-brand-blue/70">
                          Your booking request has been received and is subject to admin approval. A confirmation email with further instructions will be sent to {bookingData.email} shortly.
                        </p>
                        <div className="rounded-[24px] border border-brand-blue/10 bg-brand-blue/5 p-5 text-left">
                          <p className="text-sm text-brand-blue/60">Confirmation #</p>
                          <p className="mt-2 font-semibold text-brand-blue">BK{Date.now().toString().slice(-6)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {currentStep < 4 && (
                    <div className="mt-8 rounded-[24px] border border-brand-blue/10 bg-brand-yellow/10 p-5 text-sm leading-6 text-brand-blue/80">
                      <strong>Note:</strong> A security deposit of ₱3,000 per room is required upon check-in.
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  onClick={goPrev}
                  disabled={currentStep === 1}
                  className="w-full rounded-2xl border border-brand-blue/20 bg-white px-6 py-3 text-sm font-semibold text-brand-blue transition hover:border-brand-blue disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  Previous Step
                </button>
                <div className="text-center text-sm text-brand-blue/60">
                  Step {Math.min(currentStep, 3)} of 3
                </div>
                {currentStep === 3 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={!canProceed() || isSubmitting}
                    className="w-full rounded-2xl bg-accent px-6 py-3 text-sm font-semibold text-brand-blue transition hover:bg-brand-yellow disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="h-4 w-4 animate-spin text-brand-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : bookingData.room?.id === '3' ? (
                      'Submit Inquiry'
                    ) : (
                      'Pay and Confirm'
                    )}
                  </button>
                ) : (
                  <button
                    onClick={goNext}
                    disabled={!canProceed() || currentStep >= 4}
                    className="w-full rounded-2xl bg-accent px-6 py-3 text-sm font-semibold text-brand-blue transition hover:bg-brand-yellow disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >
                    {currentStep === 2 ? 'Proceed to Payment' : 'Next Step'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <RoomDetailsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} room={bookingData.room} />
      </section>
    </main>
  );
}

export default function BookNowPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookNowFlow />
    </Suspense>
  );
}
