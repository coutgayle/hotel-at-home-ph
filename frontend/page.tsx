'use client';

import React, { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Attempt to auto-login if password is saved in session
  useEffect(() => {
    const savedPwd = sessionStorage.getItem('admin_pwd');
    if (savedPwd) {
      setPassword(savedPwd);
      fetchBookings(savedPwd);
    }
  }, []);

  const fetchBookings = async (pwd: string) => {
    setLoading(true);
    setError('');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/api/admin/bookings`, {
        headers: {
          'x-api-key': pwd
        }
      });
      const data = await res.json();
      
      if (res.ok) {
        setBookings(data);
        setIsAuthenticated(true);
        sessionStorage.setItem('admin_pwd', pwd); // Save session
      } else {
        setError(data.error || 'Access Denied. Incorrect password.');
        sessionStorage.removeItem('admin_pwd');
      }
    } catch (err) {
      setError('Network error. Ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBookings(password);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setBookings([]);
    sessionStorage.removeItem('admin_pwd');
  };

  const updateStatus = async (id: number, newStatus: string) => {
    if (!confirm(`Are you sure you want to mark this booking as ${newStatus.toUpperCase()}?`)) return;
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/api/admin/bookings/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': password
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (res.ok) {
        fetchBookings(password); // Refresh the table
      } else {
        alert('Failed to update status.');
      }
    } catch (err) {
      alert('Network error while updating status.');
    }
  };

  const getRoomName = (roomId: number) => {
    switch (roomId) {
      case 1: return 'Gold Room';
      case 2: return 'Blue Room';
      case 3: return 'Rooftop Lounge';
      default: return 'Unknown';
    }
  };

  // Format date to local string
  const displayDate = (dateStr: string) => {
    if (!dateStr) return '--';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // --- LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6 font-sans">
        <div className="bg-white p-8 rounded border border-gray-300 shadow-sm w-full max-w-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
            <p className="text-sm text-gray-500 mt-1">Enter your master password to continue.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password" 
              className="w-full border border-gray-300 p-2 focus:outline-none focus:border-blue-500 rounded"
              required
            />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 text-white rounded p-2 font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Login'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  // --- DASHBOARD SCREEN ---
  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      <div className="max-w-[90rem] mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Total Bookings: {bookings.length}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => fetchBookings(password)} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded text-sm hover:bg-gray-50 transition">
              Refresh Data
            </button>
            <button onClick={handleLogout} className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 font-medium rounded text-sm hover:bg-red-100 transition">
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-gray-100 text-sm uppercase tracking-wider text-gray-600 border-b border-gray-200">
                  <th className="p-4 font-medium">Code</th>
                  <th className="p-4 font-medium">Guest</th>
                  <th className="p-4 font-medium">Room</th>
                  <th className="p-4 font-medium">Dates</th>
                  <th className="p-4 font-medium">Price</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-200">
                {bookings.length === 0 ? (
                  <tr><td colSpan={7} className="p-8 text-center text-gray-500">No bookings found.</td></tr>
                ) : (
                  bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50 transition">
                      <td className="p-4 font-mono font-medium text-gray-800">{b.confirmation_code}</td>
                      <td className="p-4">
                        <p className="font-medium text-gray-900">{b.guest_first_name} {b.guest_last_name}</p>
                        <p className="text-xs text-gray-500">{b.guest_email}</p>
                        <p className="text-xs text-gray-500">{b.guest_phone}</p>
                      </td>
                      <td className="p-4 text-gray-800">{getRoomName(b.room_id)}</td>
                      <td className="p-4 text-gray-800 whitespace-nowrap">{displayDate(b.check_in)} <br/>to {displayDate(b.check_out)}</td>
                      <td className="p-4 font-medium text-gray-900">₱{parseFloat(b.total_price).toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${
                          b.status === 'confirmed' ? 'bg-green-100 text-green-800 border border-green-200' : 
                          b.status === 'cancelled' ? 'bg-red-100 text-red-800 border border-red-200' : 
                          'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {b.status === 'pending' && (
                            <>
                              <button onClick={() => updateStatus(b.id, 'confirmed')} className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded transition">Confirm</button>
                              <button onClick={() => updateStatus(b.id, 'cancelled')} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition">Cancel</button>
                            </>
                          )}
                          {b.status === 'confirmed' && (
                            <button onClick={() => updateStatus(b.id, 'cancelled')} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition">Cancel Booking</button>
                          )}
                          {b.status === 'cancelled' && (
                            <button onClick={() => updateStatus(b.id, 'pending')} className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-medium rounded transition">Make Pending</button>
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