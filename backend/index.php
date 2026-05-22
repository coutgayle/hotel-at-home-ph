<?php
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Hotel at Home</title>
    <style>
        @font-face {
            font-family: 'Edwardian Script ITC';
            src: url('/fonts/edwardianscriptitc.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
        }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f3f6fb; color: #011478; margin: 0; padding: 20px; }
        .container { max-width: 1200px; margin: 20px auto; background: white; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e0e7ff; overflow: hidden; }
        header { background-color: #011478; color: white; padding: 20px; }
        header h1 { margin: 0; font-size: 24px; }
        header p { margin: 8px 0 0; color: #facc15; font-family: 'Edwardian Script ITC', cursive; font-size: 26px; letter-spacing: 1px; }
        .content { padding: 20px; }
        table { width: 100%; border-collapse: collapse; font-size: 14px; }
        th, td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #e0e7ff; }
        th { background-color: #f3f6fb; font-weight: 600; text-transform: uppercase; font-size: 12px; }
        tr:hover { background-color: #f9fafb; }
        select { padding: 6px 10px; border-radius: 8px; border: 1px solid #ccc; font-family: inherit; font-size: 14px; }
        .status { padding: 4px 8px; border-radius: 12px; font-weight: 600; font-size: 12px; text-transform: capitalize; }
        .status-pending { background-color: #fffbeb; color: #b45309; }
        .status-confirmed { background-color: #f0fdf4; color: #166534; }
        .status-cancelled { background-color: #fee2e2; color: #991b1b; }
        #loader { text-align: center; padding: 40px; font-weight: 500; }
        .btn-signout { background-color: #facc15; color: #011478; border: none; padding: 8px 16px; border-radius: 20px; font-weight: bold; cursor: pointer; font-family: inherit; font-size: 14px; }
        .btn-signout:hover { filter: brightness(0.9); }
        .login-input { width: 100%; padding: 12px; border-radius: 12px; border: 1px solid #e0e7ff; font-family: inherit; font-size: 14px; box-sizing: border-box; outline: none; transition: border-color 0.2s; }
        .login-input:focus { border-color: #011478; }
        .login-label { display: block; font-size: 12px; font-weight: 600; text-transform: uppercase; color: rgba(1, 20, 120, 0.6); margin-bottom: 6px; }
        .btn-submit { width: 100%; background-color: #011478; color: white; border: none; padding: 14px; border-radius: 20px; font-weight: bold; cursor: pointer; font-family: inherit; font-size: 14px; transition: background-color 0.2s; margin-top: 10px; }
        .btn-submit:hover { background-color: #001a72; }
        .header-flex { display: flex; justify-content: space-between; align-items: center; }
    </style>
</head>
<body>

    <!-- Login Screen -->
    <div id="login-screen" class="container" style="max-width: 400px; margin: 80px auto; display: none;">
        <header style="text-align: center;">
            <h1>System Admin</h1>
            <p style="font-size: 14px;">Please authenticate to continue.</p>
        </header>
        <div class="content" style="padding: 30px;">
            <form id="login-form">
                <div style="margin-bottom: 20px;">
                    <label class="login-label">Username</label>
                    <input type="text" id="username" class="login-input" required>
                </div>
                <div style="margin-bottom: 20px;">
                    <label class="login-label">Password</label>
                    <input type="password" id="password" class="login-input" required>
                </div>
                <p id="login-error" style="color: #991b1b; font-size: 14px; text-align: center; display: none; margin-bottom: 15px; font-weight: 500;"></p>
                <button type="submit" id="login-btn" class="btn-submit">Sign In</button>
            </form>
        </div>
    </div>

    <!-- Dashboard Screen -->
    <div id="dashboard-screen" class="container" style="display: none;">
        <header class="header-flex">
            <div>
                <h1>Admin Dashboard</h1>
                <p>Hotel at Home Bookings</p>
            </div>
            <button onclick="signOut()" class="btn-signout">Sign Out</button>
        </header>
        <div class="content">
            <div style="overflow-x: auto;">
                <table id="bookings-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Code</th>
                            <th>Room</th>
                            <th>Guest</th>
                            <th>Check-in</th>
                            <th>Check-out</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody id="bookings-tbody">
                        <tr>
                            <td colspan="9" id="loader">Loading bookings...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <script>
        // --- CONFIGURATION ---
        // This should be your production backend URL
        const API_BASE_URL = 'https://hotelathomeph.com/api'; 
        
        let currentApiKey = sessionStorage.getItem('admin_pwd') || '';

        const roomNames = {
            1: 'Gold Room',
            2: 'Blue Room',
            3: 'Rooftop Lounge'
        };

        document.addEventListener('DOMContentLoaded', function() {
            if (currentApiKey) {
                showDashboard();
                fetchBookings();
            } else {
                showLogin();
            }

            document.getElementById('login-form').addEventListener('submit', function(e) {
                e.preventDefault();
                const user = document.getElementById('username').value;
                const pass = document.getElementById('password').value;
                const errorEl = document.getElementById('login-error');
                const btn = document.getElementById('login-btn');

                if (user !== 'admin') {
                    errorEl.textContent = 'Invalid username or password.';
                    errorEl.style.display = 'block';
                    return;
                }

                errorEl.style.display = 'none';
                btn.textContent = 'Authenticating...';
                btn.disabled = true;

                fetch(`${API_BASE_URL}/admin/bookings`, {
                    headers: { 'x-api-key': pass }
                })
                .then(response => {
                    if (!response.ok) {
                        if (response.status === 401) throw new Error('Access Denied. Incorrect password.');
                        throw new Error(`Network error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(bookings => {
                    currentApiKey = pass;
                    sessionStorage.setItem('admin_user', user);
                    sessionStorage.setItem('admin_pwd', pass);
                    document.getElementById('password').value = '';
                    showDashboard();
                    renderTable(bookings);
                })
                .catch(error => {
                    errorEl.textContent = error.message;
                    errorEl.style.display = 'block';
                })
                .finally(() => {
                    btn.textContent = 'Sign In';
                    btn.disabled = false;
                });
            });
        });

        window.addEventListener('popstate', function() {
            if (window.location.hash !== '#dashboard') {
                // If user clicks "Back" button, securely log them out
                signOut();
            } else if (!currentApiKey) {
                // Prevent "Forward" button from showing dashboard if logged out
                showLogin();
            }
        });

        window.addEventListener('pageshow', function(event) {
            if (event.persisted && !sessionStorage.getItem('admin_pwd')) {
                // Prevent browser from showing cached dashboard if logged out
                showLogin();
            }
        });

        function showLogin() {
            document.getElementById('login-screen').style.display = 'block';
            document.getElementById('dashboard-screen').style.display = 'none';
            document.getElementById('bookings-tbody').innerHTML = ''; // Clear sensitive data
            if (window.location.hash === '#dashboard') {
                window.history.replaceState(null, '', window.location.pathname);
            }
        }

        function showDashboard() {
            document.getElementById('login-screen').style.display = 'none';
            document.getElementById('dashboard-screen').style.display = 'block';
            // Add a history state so the "Back" button can be intercepted
            if (window.location.hash !== '#dashboard') {
                window.history.pushState(null, '', '#dashboard');
            }
        }

        function signOut() {
            sessionStorage.removeItem('admin_user');
            sessionStorage.removeItem('admin_pwd');
            currentApiKey = '';
            showLogin();
        }

        function fetchBookings() {
            const tableBody = document.getElementById('bookings-tbody');
            tableBody.innerHTML = '<tr><td colspan="9" id="loader">Loading bookings...</td></tr>';

            fetch(`${API_BASE_URL}/admin/bookings`, {
                headers: { 'x-api-key': currentApiKey }
            })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 401) {
                        signOut();
                        throw new Error('Session expired. Please log in again.');
                    }
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(bookings => {
                renderTable(bookings);
            })
            .catch(error => {
                console.error('Error fetching bookings:', error);
                if (!currentApiKey) return; // Silent if we just signed out
                
                let errorMessage = 'An unexpected error occurred.';
                if (error.message.includes('Failed to fetch')) {
                    errorMessage = 'Network Error: Cannot connect to the API. Please check if the backend is running and look for CORS errors in the browser console (F12).';
                } else {
                    errorMessage = `Failed to load bookings. Please check the API connection. (${error.message})`;
                }
                tableBody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 40px; color: #991b1b;">${errorMessage}</td></tr>`;
            });
        }

        function renderTable(bookings) {
            const tableBody = document.getElementById('bookings-tbody');
            tableBody.innerHTML = ''; // Clear loader/old data

            if (bookings.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 40px;">No bookings found.</td></tr>';
                return;
            }

            bookings.forEach(booking => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${booking.id}</td>
                    <td><strong>${booking.confirmation_code}</strong></td>
                    <td>${roomNames[booking.room_id] || 'Unknown'}</td>
                    <td>${booking.guest_first_name} ${booking.guest_last_name}</td>
                    <td>${new Date(booking.check_in).toLocaleDateString()}</td>
                    <td>${new Date(booking.check_out).toLocaleDateString()}</td>
                    <td>₱${Number(booking.total_price).toLocaleString()}</td>
                    <td><span class="status status-${booking.status}">${booking.status}</span></td>
                    <td>
                        <select onchange="updateStatus(${booking.id}, this.value, this, '${booking.status}')">
                            <option value="pending" ${booking.status === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="confirmed" ${booking.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                            <option value="cancelled" ${booking.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        }

        function updateStatus(bookingId, newStatus, selectElement, oldStatus) {
            // Disable the dropdown to prevent multiple clicks
            selectElement.disabled = true;

            fetch(`${API_BASE_URL}/admin/bookings/${bookingId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': currentApiKey
                },
                body: JSON.stringify({ status: newStatus })
            })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 401) {
                        signOut();
                        throw new Error('Session expired');
                    }
                    throw new Error('Failed to update status.');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    // Refresh the data to show the change
                    fetchBookings(); 
                } else {
                    alert('Failed to update status: ' + (data.error || 'Unknown error'));
                    selectElement.value = oldStatus; // Revert to old value on failure
                    selectElement.disabled = false; // Re-enable on failure
                }
            })
            .catch(error => {
                console.error('Error updating status:', error);
                if (currentApiKey) alert('An error occurred while updating the status.');
                selectElement.value = oldStatus; // Revert to old value on failure
                selectElement.disabled = false; // Re-enable on failure
            });
        }
    </script>

</body>
</html>