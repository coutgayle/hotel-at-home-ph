<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Hotel at Home</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f3f6fb; color: #011478; margin: 0; padding: 20px; }
        .container { max-width: 1200px; margin: 20px auto; background: white; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e0e7ff; overflow: hidden; }
        header { background-color: #011478; color: white; padding: 20px; }
        header h1 { margin: 0; font-size: 24px; }
        header p { margin: 5px 0 0; color: #facc15; }
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
    </style>
</head>
<body>

    <div class="container">
        <header>
            <h1>Admin Dashboard</h1>
            <p>Hotel at Home Bookings</p>
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
        const API_BASE_URL = 'https://www.hotelathomeph.com/api'; 
        
        // This API key is securely injected by PHP from a server-side environment variable.
        // This prevents the key from being exposed in your public source code.
        const API_KEY = '<?php echo getenv("ADMIN_SECRET") ?: "hotelathomeadmin"; ?>';

        const roomNames = {
            1: 'Gold Room',
            2: 'Blue Room',
            3: 'Rooftop Lounge'
        };

        document.addEventListener('DOMContentLoaded', function() {
            fetchBookings();
        });

        function fetchBookings() {
            fetch(`${API_BASE_URL}/admin/bookings`, {
                headers: { 'x-api-key': API_KEY }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(bookings => {
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
                            <select onchange="updateStatus(${booking.id}, this.value, this)">
                                <option value="pending" ${booking.status === 'pending' ? 'selected' : ''}>Pending</option>
                                <option value="confirmed" ${booking.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                                <option value="cancelled" ${booking.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                            </select>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            })
            .catch(error => {
                console.error('Error fetching bookings:', error);
                const tableBody = document.getElementById('bookings-tbody');
                tableBody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 40px; color: #991b1b;">Failed to load bookings. Check API connection and key.</td></tr>`;
            });
        }

        function updateStatus(bookingId, newStatus, selectElement) {
            // Disable the dropdown to prevent multiple clicks
            selectElement.disabled = true;

            fetch(`${API_BASE_URL}/admin/bookings/${bookingId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY
                },
                body: JSON.stringify({ status: newStatus })
            })
            .then(response => {
                if (!response.ok) throw new Error('Failed to update status.');
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    // Refresh the data to show the change
                    fetchBookings(); 
                } else {
                    alert('Failed to update status: ' + (data.error || 'Unknown error'));
                    selectElement.disabled = false; // Re-enable on failure
                }
            })
            .catch(error => {
                console.error('Error updating status:', error);
                alert('An error occurred while updating the status.');
                selectElement.disabled = false; // Re-enable on failure
            });
        }
    </script>

</body>
</html>