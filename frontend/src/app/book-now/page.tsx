'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// --- MOCK DATA ---
// In the future, these will come from your database
const mockRooms = [
  { 
    id: 1, name: 'Gold Room', price: 5500, capacity: 2, image: '/img/gold-room/gold1.jpg',
    imagesCount: 15, folder: 'gold-room', prefix: 'gold',
    features: ['50 SQM', 'Ideal for 2 guests', '1 King size bed', '1 Bathroom', '4-Seater Dining Table', 'Kitchen cabinet with sink', 'Personal Ref', 'Air conditioning and WiFi', '55" Smart TV with Bluetooth Speaker', 'Electric Kettle', 'Toiletries, towels, and bathrobe', 'Contemporary artwork', 'Parking space'] 
  },
  { 
    id: 2, name: 'Blue Room', price: 5500, capacity: 4, image: '/img/blue-room/blue1.jpg',
    imagesCount: 13, folder: 'blue-room', prefix: 'blue',
    features: ['50 SQM', 'Ideal for 4 guests', '2 Queen size beds', '1 Bathroom', '6-Seater Dining Table', 'Kitchen cabinet with sink', 'Personal Ref', 'Air conditioning and WiFi', '55" Smart TV with DVD speaker', 'Electric Kettle', 'Toiletries, towels, and bathrobe', 'Contemporary artwork', 'Parking space'] 
  },
  { 
    id: 3, name: 'Rooftop Lounge', price: null, capacity: 20, image: '/img/rooftop/rooftop1.jpg',
    imagesCount: 13, folder: 'rooftop', prefix: 'rooftop',
    features: ['150 SQM', 'Outdoor and indoor seating', 'Bar counter', 'Dining table setup', 'Air conditioning and WiFi', '65" Smart TV with DVD speaker', 'Microphone for Karaoke - available upon request', 'Contemporary artwork'] 
  },
];

// Mocked fully booked / holiday dates
const mockBlockedDates = [
  '2026-05-15',
  '2026-05-16',
  '2026-05-24',
  '2026-05-25',
  '2026-06-12',
];

// --- HELPER FUNCTIONS ---
const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const getStartOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// --- COMPONENTS ---

function SmartCalendar({
  checkIn,
  checkOut,
  onChange,
}: {
  checkIn: Date | null;
  checkOut: Date | null;
  onChange: (inDate: Date | null, outDate: Date | null) => void;
}) {
  const [currentMonth, setCurrentMonth] = useState(getStartOfDay(new Date()));

  // Buffer calculation: Soonest check-in is 3 days from today
  const today = getStartOfDay(new Date());
  const minDate = addDays(today, 3);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isBlocked = (date: Date) => {
    return mockBlockedDates.includes(formatDate(date));
  };

  const isValidRange = (start: Date, end: Date) => {
    let curr = new Date(start);
    while (curr <= end) {
      if (isBlocked(curr)) return false;
      curr.setDate(curr.getDate() + 1);
    }
    return true;
  };

  const handleDateClick = (clickedDate: Date) => {
    if (clickedDate < minDate || isBlocked(clickedDate)) return;

    if (!checkIn || (checkIn && checkOut)) {
      // Start new selection
      onChange(clickedDate, null);
    } else {
      // We have check-in, selecting check-out
      if (clickedDate < checkIn) {
        onChange(clickedDate, null);
      } else {
        // Ensure no blocked dates are between check-in and check-out
        if (isValidRange(checkIn, clickedDate)) {
          onChange(checkIn, clickedDate);
        } else {
          // If there is a blocked date in between, reset selection to the clicked date
          onChange(clickedDate, null);
        }
      }
    }
  };

  const renderDays = () => {
    const days = [];
    // Empty slots before first day
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    }

    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      const dateStr = formatDate(date);
      const isPastOrBuffer = date < minDate;
      const isFullyBooked = mockBlockedDates.includes(dateStr);
      const isDisabled = isPastOrBuffer || isFullyBooked;

      const isCheckIn = checkIn && formatDate(checkIn) === dateStr;
      const isCheckOut = checkOut && formatDate(checkOut) === dateStr;
      const isInRange = checkIn && checkOut && date > checkIn && date < checkOut;

      let baseClasses = "relative flex h-10 w-10 items-center justify-center rounded-full text-sm transition ";
      
      if (isDisabled) {
        baseClasses += "cursor-not-allowed text-gray-300 ";
        if (isFullyBooked) baseClasses += "line-through decoration-red-400/50 ";
      } else if (isCheckIn || isCheckOut) {
        baseClasses += "bg-brand-blue text-white font-semibold shadow-md ";
      } else if (isInRange) {
        baseClasses += "bg-brand-blue/10 text-brand-blue font-medium rounded-none ";
      } else {
        baseClasses += "text-brand-blue hover:bg-brand-blue/5 cursor-pointer ";
      }

      days.push(
        <div key={i} className="flex justify-center p-1">
          <button
            type="button"
            onClick={() => handleDateClick(date)}
            disabled={isDisabled}
            className={baseClasses}
            title={isFullyBooked ? "Fully Booked/Holiday" : ""}
          >
            {i}
            {isFullyBooked && !isPastOrBuffer && (
               <span className="absolute bottom-1 h-1 w-1 rounded-full bg-red-400"></span>
            )}
          </button>
        </div>
      );
    }
    return days;
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="w-full max-w-sm mx-auto rounded-3xl border border-brand-blue/10 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <button onClick={handlePrevMonth} className="rounded-full p-2 text-brand-blue/70 hover:bg-slate-100 transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h3 className="font-semibold text-brand-blue">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button onClick={handleNextMonth} className="rounded-full p-2 text-brand-blue/70 hover:bg-slate-100 transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* Days Header */}
      <div className="mb-2 grid grid-cols-7 text-center text-xs font-semibold text-brand-blue/50 uppercase">
        <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-y-2">
        {renderDays()}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-brand-blue/70 border-t border-brand-blue/5 pt-4">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-brand-blue"></span> Selected
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full border border-gray-300 flex items-center justify-center"><span className="h-1 w-1 bg-red-400 rounded-full"></span></span> Unavailable
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ currentStep }: { currentStep: number }) {
  const steps = ["Room", "Dates", "Add-ons", "Guests", "Payment", "Rules"];
  
  return (
    <div className="mb-12 relative w-full max-w-3xl mx-auto">
      <div className="absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 bg-brand-blue/10 z-0"></div>
      <div 
        className="absolute top-1/2 left-0 h-0.5 -translate-y-1/2 bg-brand-blue transition-all duration-300 z-0"
        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
      ></div>
      <div className="relative z-10 flex justify-between">
        {steps.map((label, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < currentStep;
          const isActive = stepNum === currentStep;
          
          return (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors duration-300
                ${isActive ? 'bg-brand-blue text-white ring-4 ring-brand-blue/20' : 
                  isCompleted ? 'bg-brand-blue text-white' : 'bg-white text-brand-blue border border-brand-blue/20'}`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  stepNum
                )}
              </div>
              <span className={`text-xs hidden md:block ${isActive || isCompleted ? 'text-brand-blue font-semibold' : 'text-brand-blue/50'}`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BookNowContent() {
  const searchParams = useSearchParams();
  
  // State
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(
    searchParams.get('roomId') ? parseInt(searchParams.get('roomId') as string) : null
  );
  const [checkIn, setCheckIn] = useState<Date | null>(
    searchParams.get('checkIn') ? new Date(searchParams.get('checkIn') as string) : null
  );
  const [checkOut, setCheckOut] = useState<Date | null>(
    searchParams.get('checkOut') ? new Date(searchParams.get('checkOut') as string) : null
  );
  const [guests, setGuests] = useState(
    searchParams.get('guests') ? parseInt(searchParams.get('guests') as string) : 1
  );
  const [guestDetails, setGuestDetails] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [paymentDetails, setPaymentDetails] = useState<{ method: string; proof: File | null; idFront: File | null; idBack: File | null }>({ method: 'gcash', proof: null, idFront: null, idBack: null });
  const [isCheckingDates, setIsCheckingDates] = useState(false);
  const [datesAvailable, setDatesAvailable] = useState(!!(searchParams.get('checkIn') && searchParams.get('checkOut')));
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [viewBookingModal, setViewBookingModal] = useState(false);
  const [viewBookingCode, setViewBookingCode] = useState('');
  const [agreedToRules, setAgreedToRules] = useState(false);
  const [viewRoomDetails, setViewRoomDetails] = useState(false);

  // Calculate derived values
  const selectedRoom = mockRooms.find(r => r.id === selectedRoomId);
  
  let nights = 0;
  if (checkIn && checkOut) {
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  const roomTotal = selectedRoom && selectedRoom.price !== null ? (nights > 0 ? selectedRoom.price * nights : selectedRoom.price) : null;

  const isStep4Valid = guestDetails.firstName && guestDetails.lastName && guestDetails.email && guestDetails.phone;
  const isStep5Valid = paymentDetails.idFront && paymentDetails.idBack && (paymentDetails.method === 'cash' || paymentDetails.proof);

  const handleNext = () => {
    if (currentStep === 1 && !selectedRoomId) return;
    if (currentStep === 2 && (!checkIn || !checkOut)) return;
    if (currentStep === 4 && !isStep4Valid) return;
    if (currentStep === 5 && !isStep5Valid) return;
    if (currentStep === 6) {
      if (!agreedToRules) return;
      const code = 'HH-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      setConfirmationCode(code);
      setBookingConfirmed(true);
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 6));
  };

  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  if (bookingConfirmed) {
    return (
      <main className="min-h-screen bg-[#f3f6fb] text-brand-blue pb-20 pt-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="bg-white rounded-[32px] p-10 shadow-sm border border-brand-blue/5 mt-10">
            <svg className="w-20 h-20 text-green-500 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h1 className="text-4xl font-script text-brand-blue mb-4">Booking Confirmed!</h1>
            <p className="text-brand-blue/70 mb-8">Thank you for choosing Hotel at Home. We have received your reservation.</p>
            
            <div className="bg-brand-blue/5 rounded-2xl p-6 mb-8 inline-block">
              <p className="text-sm uppercase tracking-wider text-brand-blue/60 mb-2 font-semibold">Your Confirmation Code</p>
              <p className="text-3xl font-bold text-brand-blue tracking-widest">{confirmationCode}</p>
            </div>
            
            <p className="text-sm text-brand-blue/70">Please save this code. You can use it in the "View Booking" feature to check your reservation status.</p>
            
            <div className="mt-10">
              <a href="/" className="inline-flex rounded-full bg-brand-blue px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#001a72]">Return to Home</a>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f3f6fb] text-brand-blue pb-20 pt-24">
      {/* View Booking Modal */}
      {viewBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-lg relative">
            <button onClick={() => setViewBookingModal(false)} className="absolute right-6 top-6 text-brand-blue/50 hover:text-brand-blue transition">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-brand-blue">View Your Booking</h2>
            <p className="text-sm text-brand-blue/70 mb-6">Enter your confirmation code to check the status of your reservation.</p>
            <input type="text" placeholder="e.g. HH-ABC123" value={viewBookingCode} onChange={(e) => setViewBookingCode(e.target.value)} className="w-full rounded-xl border border-brand-blue/10 bg-white px-4 py-3 outline-none focus:border-brand-blue transition mb-4 uppercase" />
            <button onClick={() => { alert('Booking lookup functionality will be available once backend is connected.'); setViewBookingModal(false); }} className="w-full rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#001a72]">
              Check Status
            </button>
          </div>
        </div>
      )}

      {/* Room Details Modal */}
      {viewRoomDetails && selectedRoom && (
        <RoomDetailsModal room={selectedRoom} onClose={() => setViewRoomDetails(false)} />
      )}

      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center relative">
          <div className="absolute right-0 top-0 hidden sm:block">
            <button onClick={() => setViewBookingModal(true)} className="text-sm font-semibold text-brand-blue hover:text-accent underline transition">View Booking</button>
          </div>
          <h1 className="text-4xl font-script text-brand-blue md:text-5xl">Book Your Stay</h1>
          <p className="mt-3 text-brand-blue/70">Complete your reservation in just a few simple steps</p>
          <div className="mt-4 sm:hidden">
            <button onClick={() => setViewBookingModal(true)} className="text-sm font-semibold text-brand-blue hover:text-accent underline transition">View Booking</button>
          </div>
        </div>

        <ProgressBar currentStep={currentStep} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 mt-10">
          
          {/* LEFT COLUMN: Form Steps */}
          <div className="bg-white rounded-[32px] p-6 md:p-10 shadow-sm border border-brand-blue/5">
            
            {/* STEP 1: Select Room */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold mb-6">Select Accommodation</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {mockRooms.map(room => (
                    <div 
                      key={room.id}
                      onClick={() => {
                        setSelectedRoomId(room.id);
                        if (guests > room.capacity) setGuests(room.capacity);
                      }}
                      className={`cursor-pointer overflow-hidden rounded-2xl border-2 transition-all duration-200 ${
                        selectedRoomId === room.id 
                          ? 'border-brand-blue shadow-md bg-brand-blue/5' 
                          : 'border-brand-blue/10 bg-white hover:border-brand-blue/30'
                      }`}
                    >
                      <div className="h-32 w-full overflow-hidden bg-slate-200 relative">
                        {room.image ? (
                           <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                        ) : (
                           <div className="absolute inset-0 flex items-center justify-center text-sm text-brand-blue/50">Image</div>
                        )}
                        {selectedRoomId === room.id && (
                          <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-brand-blue text-white flex items-center justify-center shadow-sm">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold">{room.name}</h3>
                        <p className="text-sm text-brand-blue/60 mt-1">Up to {room.capacity} guests</p>
                        {room.price !== null ? (
                          <p className="font-bold text-sm mt-3 uppercase tracking-wider text-accent">₱{room.price.toLocaleString()} / night</p>
                        ) : (
                          <p className="font-bold text-sm mt-3 uppercase tracking-wider text-accent">TBA / night</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {selectedRoom && (
                  <div className="mt-8 rounded-2xl border border-brand-blue/10 bg-brand-blue/5 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">Number of Guests</h3>
                      <p className="text-sm text-brand-blue/60 mt-1">Maximum capacity is {selectedRoom.capacity} guests.</p>
                    </div>
                    <div className="flex items-center gap-4 bg-white rounded-full px-4 py-2 border border-brand-blue/10 shadow-sm w-fit">
                      <button type="button" onClick={() => setGuests(Math.max(1, guests - 1))} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-lg transition font-medium text-brand-blue" disabled={guests <= 1}>-</button>
                      <span className="w-6 text-center font-semibold">{guests}</span>
                      <button type="button" onClick={() => setGuests(Math.min(selectedRoom.capacity, guests + 1))} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-lg transition font-medium text-brand-blue" disabled={guests >= selectedRoom.capacity}>+</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: Choose Dates */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold">Choose Your Dates</h2>
                  <p className="text-sm text-brand-blue/60 mt-1">Select your check-in and check-out dates. Earliest check-in starts 3 days from today.</p>
                </div>
                
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex-shrink-0 w-full md:w-auto">
                    <SmartCalendar 
                      checkIn={checkIn} 
                      checkOut={checkOut} 
                      onChange={(inD, outD) => { 
                        setCheckIn(inD); 
                        setCheckOut(outD); 
                        if (inD && outD) {
                          setIsCheckingDates(true);
                          setDatesAvailable(false);
                          setTimeout(() => {
                            setIsCheckingDates(false);
                            setDatesAvailable(true);
                          }, 1500);
                        } else {
                          setDatesAvailable(false);
                        }
                      }} 
                    />
                  </div>
                  
                  <div className="flex-1 w-full space-y-4 pt-4 md:pt-10">
                    <div className="rounded-2xl border border-brand-blue/10 bg-brand-blue/5 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-brand-blue/50 mb-1">Check-in</p>
                      <p className="font-medium">{checkIn ? checkIn.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }) : 'Select date'}</p>
                      <p className="text-xs text-brand-blue/60 mt-1">From 2:00 PM</p>
                    </div>
                    <div className="rounded-2xl border border-brand-blue/10 bg-brand-blue/5 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-brand-blue/50 mb-1">Check-out</p>
                      <p className="font-medium">{checkOut ? checkOut.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }) : 'Select date'}</p>
                      <p className="text-xs text-brand-blue/60 mt-1">By 12:00 PM</p>
                    </div>
                  
                    {checkIn && checkOut && (
                      <div className="mt-2 p-4 rounded-xl border border-brand-blue/10 bg-white flex items-center gap-3 w-fit">
                        {isCheckingDates ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-brand-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            <span className="font-medium text-sm text-brand-blue/70">Checking availability for selected dates...</span>
                          </>
                        ) : datesAvailable ? (
                          <>
                            <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            <span className="font-medium text-sm text-green-600">Dates are available!</span>
                          </>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Add-ons (Placeholder) */}
            {currentStep === 3 && (
              <div className="py-20 text-center space-y-4 border-2 border-dashed border-brand-blue/10 rounded-2xl">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-brand-blue/30">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.827M11.42 15.17l-3.973 3.973c-.637.636-1.748.636-2.384 0l-1.06-1.06c-.636-.637-.636-1.748 0-2.385l3.973-3.972M11.42 15.17l3.972-3.973M11.42 15.17c-2.839-2.839-2.839-7.442 0-10.281 2.84-2.84 7.443-2.84 10.282 0M6.084 10.334a1.868 1.868 0 11-2.64-2.641 1.868 1.868 0 012.64 2.641z" />
                 </svg>
                 <h2 className="text-xl font-semibold">Under Construction</h2>
                 <p className="text-brand-blue/60 text-sm max-w-sm mx-auto">
                   Add-ons functionality will be available soon. You can proceed to the next step.
                 </p>
              </div>
            )}

            {/* STEP 4: Guest Details */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Guest Details</h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-brand-blue/60 mb-2">First Name *</label>
                    <input type="text" value={guestDetails.firstName} onChange={e => setGuestDetails({...guestDetails, firstName: e.target.value})} className="w-full rounded-xl border border-brand-blue/10 bg-white px-4 py-3 outline-none focus:border-brand-blue transition" placeholder="Juan" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-brand-blue/60 mb-2">Last Name *</label>
                    <input type="text" value={guestDetails.lastName} onChange={e => setGuestDetails({...guestDetails, lastName: e.target.value})} className="w-full rounded-xl border border-brand-blue/10 bg-white px-4 py-3 outline-none focus:border-brand-blue transition" placeholder="Dela Cruz" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-brand-blue/60 mb-2">Email Address *</label>
                    <input type="email" value={guestDetails.email} onChange={e => setGuestDetails({...guestDetails, email: e.target.value})} className="w-full rounded-xl border border-brand-blue/10 bg-white px-4 py-3 outline-none focus:border-brand-blue transition" placeholder="juan@example.com" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-brand-blue/60 mb-2">Contact Number *</label>
                    <input type="tel" value={guestDetails.phone} onChange={e => setGuestDetails({...guestDetails, phone: e.target.value})} className="w-full rounded-xl border border-brand-blue/10 bg-white px-4 py-3 outline-none focus:border-brand-blue transition" placeholder="0912 345 6789" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Payment */}
            {currentStep === 5 && (
              <div className="space-y-8">
                <h2 className="text-2xl font-semibold">Payment & Verification</h2>
                
                <div className="space-y-4">
                  <p className="text-sm font-semibold uppercase tracking-wider text-brand-blue/60">1. Select Payment Method</p>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${paymentDetails.method === 'gcash' ? 'border-brand-blue bg-brand-blue/5' : 'border-brand-blue/10 hover:border-brand-blue/30'}`}>
                      <input type="radio" name="paymentMethod" value="gcash" checked={paymentDetails.method === 'gcash'} onChange={() => setPaymentDetails({...paymentDetails, method: 'gcash'})} className="h-4 w-4 text-brand-blue" />
                      <span className="font-medium">GCash</span>
                    </label>
                    <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${paymentDetails.method === 'bank' ? 'border-brand-blue bg-brand-blue/5' : 'border-brand-blue/10 hover:border-brand-blue/30'}`}>
                      <input type="radio" name="paymentMethod" value="bank" checked={paymentDetails.method === 'bank'} onChange={() => setPaymentDetails({...paymentDetails, method: 'bank'})} className="h-4 w-4 text-brand-blue" />
                      <span className="font-medium">Bank Transfer</span>
                    </label>
                    <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${paymentDetails.method === 'cash' ? 'border-brand-blue bg-brand-blue/5' : 'border-brand-blue/10 hover:border-brand-blue/30'}`}>
                      <input type="radio" name="paymentMethod" value="cash" checked={paymentDetails.method === 'cash'} onChange={() => setPaymentDetails({...paymentDetails, method: 'cash'})} className="h-4 w-4 text-brand-blue" />
                      <span className="font-medium">Cash on Arrival</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-6">
                  <p className="text-sm font-semibold uppercase tracking-wider text-brand-blue/60">2. Upload Requirements *</p>
                  
                  {paymentDetails.method !== 'cash' && (
                    <div className="rounded-xl border border-brand-blue/10 p-4">
                      <label className="block font-medium mb-1">Payment Screenshot</label>
                      <p className="text-xs text-brand-blue/60 mb-3">Please upload a clear screenshot of your successful transaction.</p>
                      <input type="file" accept="image/*" onChange={e => setPaymentDetails({...paymentDetails, proof: e.target.files?.[0] || null})} className="w-full text-sm text-brand-blue/70 file:mr-4 file:rounded-full file:border-0 file:bg-brand-blue/10 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-brand-blue hover:file:bg-brand-blue/20" />
                    </div>
                  )}

                  <div className="rounded-xl border border-brand-blue/10 p-4">
                    <label className="block font-medium mb-1">Valid ID (Front)</label>
                    <p className="text-xs text-brand-blue/60 mb-3">Upload the front picture of a valid government-issued ID.</p>
                    <input type="file" accept="image/*" onChange={e => setPaymentDetails({...paymentDetails, idFront: e.target.files?.[0] || null})} className="w-full text-sm text-brand-blue/70 file:mr-4 file:rounded-full file:border-0 file:bg-brand-blue/10 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-brand-blue hover:file:bg-brand-blue/20" />
                  </div>

                  <div className="rounded-xl border border-brand-blue/10 p-4">
                    <label className="block font-medium mb-1">Valid ID (Back)</label>
                    <p className="text-xs text-brand-blue/60 mb-3">Upload the back picture of the same valid government-issued ID.</p>
                    <input type="file" accept="image/*" onChange={e => setPaymentDetails({...paymentDetails, idBack: e.target.files?.[0] || null})} className="w-full text-sm text-brand-blue/70 file:mr-4 file:rounded-full file:border-0 file:bg-brand-blue/10 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-brand-blue hover:file:bg-brand-blue/20" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: Rules & Regulations */}
            {currentStep === 6 && (
              <div className="space-y-8">
                <h2 className="text-2xl font-semibold">Rules & Regulations</h2>
                
                <div className="rounded-2xl border border-brand-blue/10 bg-white p-6 h-64 overflow-y-auto space-y-6 text-sm text-brand-blue/80 shadow-inner">
                  <div>
                    <h3 className="font-semibold text-brand-blue mb-2 text-base">Check-in & Check-out</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Check-in: 2:00 PM</li>
                      <li>Check-out: 12:00 PM</li>
                      <li>Late check-out subject to availability.</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-blue mb-2 text-base">General Rules</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>No smoking inside the rooms.</li>
                      <li>No pets allowed.</li>
                      <li>Respect quiet hours (10 PM – 7 AM).</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-blue mb-2 text-base">Cancellation Policy</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Full refund if canceled up to 4 days before check-in.</li>
                      <li>50% refund if canceled 3 days or less before check-in.</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-blue mb-2 text-base">Damages & Liability</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Guests are responsible for any damages.</li>
                      <li>Report any issues immediately to staff.</li>
                      <li>Security deposit of ₱3,000 per room is required upon check-in.</li>
                    </ul>
                  </div>
                </div>

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-brand-blue/10 bg-brand-blue/5 p-4 transition hover:border-brand-blue/30">
                  <input type="checkbox" checked={agreedToRules} onChange={(e) => setAgreedToRules(e.target.checked)} className="mt-1 h-4 w-4 rounded text-brand-blue focus:ring-brand-blue" />
                  <span className="text-sm font-medium">
                    I have read and agree to the house rules, cancellation policy, and terms of stay.
                  </span>
                </label>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-brand-blue/10">
              <button 
                onClick={handlePrev}
                disabled={currentStep === 1}
                className={`px-6 py-2.5 rounded-full font-semibold text-sm transition ${
                  currentStep === 1 
                    ? 'opacity-0 pointer-events-none' 
                    : 'bg-slate-100 text-brand-blue hover:bg-slate-200'
                }`}
              >
                Back
              </button>
              <button 
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !selectedRoomId) ||
                  (currentStep === 2 && (!checkIn || !checkOut || isCheckingDates || !datesAvailable)) ||
                  (currentStep === 4 && !isStep4Valid) ||
                  (currentStep === 5 && !isStep5Valid) ||
                  (currentStep === 6 && !agreedToRules)
                }
                className={`px-8 py-2.5 rounded-full font-semibold text-sm transition ${
                  ((currentStep === 1 && !selectedRoomId) || (currentStep === 2 && (!checkIn || !checkOut || isCheckingDates || !datesAvailable)) || (currentStep === 4 && !isStep4Valid) || (currentStep === 5 && !isStep5Valid) || (currentStep === 6 && !agreedToRules))
                    ? 'bg-brand-blue/30 text-white cursor-not-allowed'
                    : 'bg-brand-blue text-white hover:bg-[#001a72] shadow-sm'
                }`}
              >
                {currentStep === 6 ? 'Confirm Booking' : 'Continue'}
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Booking Summary */}
          <div className="lg:sticky lg:top-24 h-fit bg-brand-blue text-white rounded-[32px] p-8 shadow-lg">
            <h3 className="font-script text-3xl text-brand-yellow mb-6 border-b border-white/10 pb-4">Booking Summary</h3>
            
            <div className="space-y-6 text-sm">
              <div>
                <p className="text-white/60 mb-1 uppercase tracking-wider text-xs">Room / Space</p>
                {selectedRoom ? (
                  <div>
                    <p className="font-medium text-lg">{selectedRoom.name}</p>
                    <button onClick={() => setViewRoomDetails(true)} className="text-xs text-brand-yellow hover:underline mt-1">View Room Details</button>
                  </div>
                ) : (
                  <p className="italic text-white/40">Not selected</p>
                )}
              </div>

              {selectedRoom && (
                <div>
                  <p className="text-white/60 mb-1 uppercase tracking-wider text-xs">Guests</p>
                  <p className="font-medium">{guests} Guest{guests > 1 ? 's' : ''}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/60 mb-1 uppercase tracking-wider text-xs">Check-in</p>
                  <p className="font-medium">{checkIn ? checkIn.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '--'}</p>
                </div>
                <div>
                  <p className="text-white/60 mb-1 uppercase tracking-wider text-xs">Check-out</p>
                  <p className="font-medium">{checkOut ? checkOut.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '--'}</p>
                </div>
              </div>

              {nights > 0 && (
                 <div>
                   <p className="text-white/60 mb-1 uppercase tracking-wider text-xs">Duration</p>
                   <p className="font-medium">{nights} Night{nights > 1 ? 's' : ''}</p>
                 </div>
              )}

              <div className="border-t border-white/10 pt-6 mt-6">
                <div className="flex justify-between items-end">
                  <span className="text-white/80">Total Due</span>
                  <span className="text-2xl font-bold text-brand-yellow tracking-wider">
                    {roomTotal !== null ? `₱${roomTotal.toLocaleString()}` : 'TBA'}
                  </span>
                </div>
                {selectedRoom && roomTotal !== null && (
                   <p className="text-right text-xs text-white/50 mt-1">Taxes and fees included</p>
                )}
              </div>
            </div>

            {/* Trust Badges / Info */}
            <div className="mt-8 pt-6 border-t border-white/10 space-y-3 text-xs text-white/60">
              <div className="flex items-center gap-2">
                 <svg className="w-4 h-4 text-brand-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                 Secure booking
              </div>
              <div className="flex items-center gap-2">
                 <svg className="w-4 h-4 text-brand-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 Flexible cancellation options
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

export default function BookNowPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-brand-blue font-semibold">
        Loading Booking System...
      </div>
    }>
      <BookNowContent />
    </Suspense>
  );
}

function RoomDetailsModal({ room, onClose }: { room: typeof mockRooms[0], onClose: () => void }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  
  const handlePrev = () => setCurrentIdx(prev => prev === 0 ? room.imagesCount - 1 : prev - 1);
  const handleNext = () => setCurrentIdx(prev => prev === room.imagesCount - 1 ? 0 : prev + 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-[32px] overflow-hidden max-w-2xl w-full shadow-lg relative flex flex-col max-h-[90vh]">
        <button onClick={onClose} className="absolute right-4 top-4 z-10 rounded-full bg-black/20 p-2 text-white hover:bg-black/40 transition">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        
        {/* Carousel */}
        <div className="relative h-64 sm:h-80 bg-slate-100 flex-shrink-0">
          <img src={`/img/${room.folder}/${room.prefix}${currentIdx + 1}.jpg`} alt={room.name} className="w-full h-full object-cover" />
          <button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-brand-blue/80 hover:bg-brand-blue p-2 text-white transition">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-brand-blue/80 hover:bg-brand-blue p-2 text-white transition">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white bg-brand-blue/60 px-3 py-1 rounded-full">
            {currentIdx + 1} / {room.imagesCount}
          </div>
        </div>

        {/* Details */}
        <div className="p-6 sm:p-8 overflow-y-auto">
          <h3 className="text-2xl font-semibold text-brand-blue mb-4">{room.name}</h3>
          <div className="grid gap-2 text-sm text-brand-blue/70 sm:grid-cols-2">
            {room.features.map((feature: string, idx: number) => (
              <p key={idx} className="flex items-start gap-2">
                <span className="text-accent mt-0.5">•</span>
                {feature}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}