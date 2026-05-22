'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface Booking {
  id: number;
  confirmation_code: string;
  room_id: number;
  guest_first_name: string;
  guest_last_name: string;
  guest_email: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
  total_price: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  purpose: string | null;
}

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchBookings = useCallback(async (key: string, isBackground = false) => {
    if (!isBackground) setIsLoading(true);
    setAuthError('');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://hotelathomeph.com';
      const res = await fetch(`${apiUrl}/api/admin/bookings`, {
        headers: { 'x-api-key': key },
        cache: 'no-store'
      });
      const data = await res.json();
      
      if (res.ok) {
        setBookings(data);
        setIsLoggedIn(true);
        sessionStorage.setItem('admin_pwd', key);
      } else {
        setAuthError(data.error || 'Access Denied. Incorrect password.');
        sessionStorage.removeItem('admin_pwd');
        setIsLoggedIn(false);
      }
    } catch (err) {
      if (!isBackground) setAuthError('Network error. Ensure the backend is running.');
    } finally {
      if (!isBackground) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedPwd = sessionStorage.getItem('admin_pwd');
    if (savedPwd) {
      setPassword(savedPwd);
      fetchBookings(savedPwd);
    }
  }, [fetchBookings]);

  // Auto-refresh data every 60 seconds
  useEffect(() => {
    if (!isLoggedIn || !password) return;
    const interval = setInterval(() => {
      fetchBookings(password, true); // true = background refresh (no loading flicker)
    }, 60000);
    return () => clearInterval(interval);
  }, [isLoggedIn, password, fetchBookings]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username !== 'admin') {
      setAuthError('Invalid username or password.');
      return;
    }
    fetchBookings(password);
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setPassword('');
    setUsername('');
    setBookings([]);
    sessionStorage.removeItem('admin_pwd');
  };

  const updateStatus = async (id: number, newStatus: string) => {
    const confirmMsg = `Are you sure you want to mark this booking as ${newStatus.toUpperCase()}?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://hotelathomeph.com';
      const res = await fetch(`${apiUrl}/api/admin/bookings/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': password,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        // Refresh list
        fetchBookings(password);
      } else {
        alert('Failed to update status.');
      }
    } catch (err) {
      alert('Network error while updating status.');
    }
  };

  const exportToCSV = () => {
    const headers = ['Ref Code', 'Guest Name', 'Email', 'Phone', 'Accommodation', 'Check In', 'Check Out', 'Amount', 'Status', 'Notes'];
    const rows = filteredBookings.map(b => [
      b.confirmation_code,
      `"${b.guest_first_name} ${b.guest_last_name}"`,
      b.guest_email,
      b.guest_phone,
      getRoomName(b.room_id),
      new Date(b.check_in).toLocaleDateString(),
      new Date(b.check_out).toLocaleDateString(),
      b.total_price,
      b.status,
      `"${(b.purpose || '').replace(/"/g, '""')}"`
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `HotelAtHome_Bookings_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getRoomName = (id: number) => {
    switch (id) {
      case 1: return 'Gold Room';
      case 2: return 'Blue Room';
      case 3: return 'Rooftop Lounge';
      default: return 'Unknown';
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.confirmation_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${b.guest_first_name} ${b.guest_last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + parseFloat(b.total_price || '0'), 0);

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-[#f3f6fb] flex items-center justify-center p-6 font-sans text-brand-blue">
        <div className="bg-white p-10 border border-brand-blue/5 rounded-[32px] w-full max-w-sm shadow-sm animate-in fade-in zoom-in duration-300">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-script text-brand-blue">System Admin</h1>
            <p className="text-sm text-brand-blue/70 mt-2">Please authenticate to continue.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-blue/60 mb-2">Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                className="w-full rounded-xl border border-brand-blue/10 bg-white px-4 py-3 outline-none focus:border-brand-blue transition" 
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-blue/60 mb-2">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="w-full rounded-xl border border-brand-blue/10 bg-white px-4 py-3 outline-none focus:border-brand-blue transition" 
                required 
              />
            </div>
            
            {authError && <p className="text-red-500 text-sm font-medium text-center">{authError}</p>}
            
            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full bg-brand-blue text-white rounded-full py-3 mt-2 text-sm font-semibold hover:bg-[#001a72] shadow-sm transition disabled:opacity-50"
            >
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f3f6fb] p-6 sm:p-10 font-sans text-brand-blue">
      <div className="max-w-[100rem] mx-auto animate-in fade-in duration-500">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-5xl font-script text-brand-blue">Booking Logs</h1>
            <p className="text-brand-blue/60 mt-1">Manage all reservations and statuses</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 border border-brand-blue/5 rounded-[24px] shadow-sm flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-blue/60">Total Bookings</span>
            <span className="text-4xl font-bold text-brand-blue mt-2">{bookings.length}</span>
          </div>
          <div className="bg-white p-6 border border-brand-blue/5 rounded-[24px] shadow-sm flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-blue/60">Pending Approvals</span>
            <span className="text-4xl font-bold text-yellow-500 mt-2">{pendingCount}</span>
          </div>
          <div className="bg-white p-6 border border-brand-blue/5 rounded-[24px] shadow-sm flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-blue/60">Confirmed</span>
            <span className="text-4xl font-bold text-green-500 mt-2">{confirmedCount}</span>
          </div>
          <div className="bg-white p-6 border border-brand-blue/5 rounded-[24px] shadow-sm flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-blue/60">Confirmed Revenue</span>
            <span className="text-4xl font-bold text-brand-yellow drop-shadow-sm mt-2">₱{totalRevenue.toLocaleString()}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col xl:flex-row gap-4 mb-8 items-center justify-between bg-white p-6 border border-brand-blue/5 rounded-[24px] shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
            <input 
              type="text" 
              placeholder="Search Code or Name..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="border border-brand-blue/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue transition w-full sm:w-64 bg-[#f3f6fb]"
            />
            <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="border border-brand-blue/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue transition bg-[#f3f6fb]"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-3 w-full xl:w-auto justify-end">
            <button onClick={exportToCSV} className="px-5 py-2.5 bg-green-50 text-green-700 border border-green-200 rounded-full text-sm font-semibold hover:bg-green-100 transition shadow-sm flex items-center gap-2">
              Export CSV
            </button>
            <button onClick={() => fetchBookings(password, false)} className="px-5 py-2.5 bg-brand-blue/10 text-brand-blue rounded-full text-sm font-semibold hover:bg-brand-blue/20 transition flex items-center gap-2">
              {isLoading ? 'Refreshing...' : 'Refresh Data'}
            </button>
            <button onClick={handleSignOut} className="px-5 py-2.5 bg-red-50 text-red-600 rounded-full text-sm font-semibold hover:bg-red-100 transition shadow-sm">
              Sign Out
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-brand-blue/5 rounded-[32px] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead>
                <tr className="bg-brand-blue/5 text-xs uppercase tracking-wider text-brand-blue/60 border-b border-brand-blue/10">
                  <th className="p-5 font-semibold">Ref Code</th>
                  <th className="p-5 font-semibold">Guest Info</th>
                  <th className="p-5 font-semibold">Space</th>
                  <th className="p-5 font-semibold">Schedule</th>
                  <th className="p-5 font-semibold">Amount</th>
                  <th className="p-5 font-semibold w-48">Notes / Requests</th>
                  <th className="p-5 font-semibold">Status</th>
                  <th className="p-5 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-brand-blue/5">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-10 text-center text-brand-blue/50 italic">
                      {isLoading ? 'Loading bookings...' : 'No records found matching your criteria.'}
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-brand-blue/5 transition duration-150">
                      <td className="p-5 font-mono font-semibold text-brand-blue">
                        {b.confirmation_code}
                      </td>
                      <td className="p-5">
                        <p className="font-semibold text-brand-blue">{b.guest_first_name} {b.guest_last_name}</p>
                        <p className="text-xs text-brand-blue/60 mt-1">{b.guest_email}</p>
                        <p className="text-xs text-brand-blue/60">{b.guest_phone}</p>
                      </td>
                      <td className="p-5 font-medium text-brand-blue">
                        {getRoomName(b.room_id)}
                      </td>
                      <td className="p-5 whitespace-nowrap text-brand-blue">
                        <div className="flex flex-col gap-1 text-xs">
                          <span className="font-medium"><span className="text-brand-blue/50 mr-1">In:</span> {new Date(b.check_in).toLocaleDateString()}</span>
                          <span className="font-medium"><span className="text-brand-blue/50 mr-1">Out:</span> {new Date(b.check_out).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="p-5 font-semibold text-brand-blue">
                        ₱{parseFloat(b.total_price).toLocaleString()}
                      </td>
                      <td className="p-5 text-xs text-brand-blue/70 whitespace-pre-wrap max-w-xs">
                        {b.purpose || '--'}
                      </td>
                      <td className="p-5">
                        <span className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full inline-block text-center w-24 ${
                          b.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          b.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex flex-wrap gap-2">
                          {b.status === 'pending' && (
                            <>
                              <button onClick={() => updateStatus(b.id, 'confirmed')} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-full transition shadow-sm">
                                Confirm
                              </button>
                              <button onClick={() => updateStatus(b.id, 'cancelled')} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-full transition shadow-sm">
                                Cancel
                              </button>
                            </>
                          )}
                          {b.status === 'confirmed' && (
                            <button onClick={() => updateStatus(b.id, 'cancelled')} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-full transition shadow-sm">
                              Cancel
                            </button>
                          )}
                          {b.status === 'cancelled' && (
                            <button onClick={() => updateStatus(b.id, 'pending')} className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-semibold rounded-full transition shadow-sm">
                              Revert
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}