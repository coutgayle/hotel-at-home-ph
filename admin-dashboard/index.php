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
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap');
        @font-face {
            font-family: 'Edwardian Script ITC';
            src: url('/fonts/edwardianscriptitc.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
        }
        body { font-family: 'DM Sans', sans-serif; background-color: #f3f6fb; color: #011478; margin: 0; padding: 20px; height: 100vh; box-sizing: border-box; overflow: hidden; }
        .container { max-width: 1260px; margin: 0 auto; background: white; border-radius: 32px; box-shadow: 0 4px 20px rgba(1, 20, 120, 0.05); border: 1px solid rgba(1, 20, 120, 0.05); overflow: hidden; }
        header { background-color: white; color: #011478; border-bottom: 1px solid rgba(1, 20, 120, 0.05); padding: 20px 40px; }
        header h1 { margin: 0; font-family: 'Edwardian Script ITC', cursive; font-size: 40px; font-weight: normal; line-height: 1.1; }
        header p { margin: 4px 0 0; color: rgba(1, 20, 120, 0.7); font-size: 15px; }
        .content { padding: 20px 40px; }
        table { width: 100%; border-collapse: collapse; font-size: 14px; }
        th, td { padding: 16px 15px; text-align: left; border-bottom: 1px solid rgba(1, 20, 120, 0.05); }
        th { position: sticky; top: 0; background-color: white; z-index: 10; font-weight: 600; text-transform: uppercase; font-size: 12px; color: rgba(1, 20, 120, 0.6); letter-spacing: 0.5px; border-bottom: 2px solid rgba(1, 20, 120, 0.05); }
        tr:hover { background-color: rgba(1, 20, 120, 0.02); }
        select { padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(1, 20, 120, 0.15); font-family: inherit; font-size: 14px; outline: none; transition: border-color 0.2s; color: #011478; background-color: white; }
        select:focus { border-color: #011478; }
        .status { padding: 6px 12px; border-radius: 12px; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block; }
        .status-pending { background-color: #fffbeb; color: #b45309; }
        .status-confirmed { background-color: #f0fdf4; color: #166534; }
        .status-cancelled { background-color: #fee2e2; color: #991b1b; }
        #loader { text-align: center; padding: 40px; font-weight: 500; color: rgba(1, 20, 120, 0.6); }
        .btn-signout { background-color: #facc15; color: #011478; border: none; padding: 10px 20px; border-radius: 9999px; font-weight: 600; cursor: pointer; font-family: inherit; font-size: 14px; transition: filter 0.2s; }
        .btn-signout:hover { filter: brightness(0.95); }
        .login-input { width: 100%; padding: 14px 16px; border-radius: 12px; border: 1px solid rgba(1, 20, 120, 0.15); font-family: inherit; font-size: 15px; box-sizing: border-box; outline: none; transition: border-color 0.2s, box-shadow 0.2s; color: #011478; }
        .login-input:focus { border-color: #011478; box-shadow: 0 0 0 2px rgba(1, 20, 120, 0.1); }
        .login-label { display: block; font-size: 12px; font-weight: 600; text-transform: uppercase; color: rgba(1, 20, 120, 0.6); margin-bottom: 8px; letter-spacing: 0.5px; }
        .btn-submit { width: 100%; background-color: #011478; color: white; border: none; padding: 16px; border-radius: 9999px; font-weight: 600; cursor: pointer; font-family: inherit; font-size: 15px; transition: background-color 0.2s; margin-top: 10px; }
        .btn-submit:hover { background-color: #001a72; }
        .header-flex { display: flex; justify-content: space-between; align-items: center; }
        
        /* Dashboard Stats & Toolbar Styles */
        .stats-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; margin-bottom: 20px; }
        .stat-card { background: white; padding: 16px; border-radius: 16px; border: 1px solid rgba(1, 20, 120, 0.05); box-shadow: 0 4px 15px rgba(1, 20, 120, 0.03); display: flex; flex-direction: column; gap: 4px;}
        .stat-card h3 { margin: 0; font-size: 11px; color: rgba(1, 20, 120, 0.6); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
        .stat-card p { margin: 0; font-size: 22px; font-weight: 700; color: #011478; }
        
        .toolbar { display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 20px; }
        .toolbar-search { flex: 1; min-width: 250px; padding: 12px 16px; border-radius: 12px; border: 1px solid rgba(1, 20, 120, 0.15); font-family: inherit; font-size: 14px; color: #011478; outline: none; transition: border-color 0.2s; }
        .toolbar-search:focus { border-color: #011478; }
        .toolbar-filter { padding: 12px 16px; border-radius: 12px; border: 1px solid rgba(1, 20, 120, 0.15); font-family: inherit; font-size: 14px; color: #011478; background-color: white; outline: none; }
        .btn-export { background-color: #f3f6fb; color: #011478; border: 1px solid rgba(1, 20, 120, 0.15); padding: 12px 20px; border-radius: 12px; font-weight: 600; cursor: pointer; font-family: inherit; font-size: 14px; transition: background-color 0.2s; }
        .btn-export:hover { background-color: #e5e9f2; }        
        .btn-icon { background-color: #f3f6fb; border: 1px solid rgba(1, 20, 120, 0.15); padding: 12px; border-radius: 12px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; transition: background-color 0.2s; }
        .btn-icon:hover { background-color: #e5e9f2; }
        .btn-icon svg { stroke: #011478; }
        .toolbar-actions { display: flex; gap: 15px; flex-wrap: wrap; }
        
        /* Action Buttons */
        .action-group { display: flex; gap: 6px; align-items: center; }
        .btn-action { padding: 6px 12px; border-radius: 8px; border: none; font-weight: 600; font-size: 12px; cursor: pointer; font-family: inherit; color: white; transition: opacity 0.2s; }
        .btn-action:hover { opacity: 0.9; }
        .btn-action:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-action.confirm { background-color: #166534; }
        .btn-action.cancel { background-color: #991b1b; }
        .btn-action.contact { background-color: #011478; }

        /* Modal Styles */
        .modal-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(1, 20, 120, 0.4); z-index: 1000; justify-content: center; align-items: center; }
        .modal-container { background: white; border-radius: 24px; padding: 32px; width: 90%; max-width: 500px; box-shadow: 0 10px 40px rgba(1, 20, 120, 0.1); }
        .modal-title { margin: 0 0 16px 0; font-size: 20px; color: #011478; }
        .modal-desc { margin: 0 0 20px 0; font-size: 14px; color: rgba(1, 20, 120, 0.7); line-height: 1.5; }
        .modal-textarea { width: 100%; height: 220px; padding: 16px; border-radius: 12px; border: 1px solid rgba(1, 20, 120, 0.15); font-family: inherit; font-size: 14px; box-sizing: border-box; resize: vertical; outline: none; transition: border-color 0.2s; color: #011478; margin-bottom: 12px; }
        .modal-textarea:focus { border-color: #011478; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 12px; }
        .btn-modal { padding: 12px 24px; border-radius: 12px; font-weight: 600; cursor: pointer; font-family: inherit; font-size: 14px; border: none; transition: background-color 0.2s; }
        .btn-modal-cancel { background-color: #f3f6fb; color: #011478; border: 1px solid rgba(1, 20, 120, 0.15); }
        .btn-modal-cancel:hover { background-color: #e5e9f2; }
        .btn-modal-submit { background-color: #011478; color: white; }
        .btn-modal-submit:hover { background-color: #001a72; }
        .btn-reason { padding: 6px 12px; border-radius: 8px; font-size: 12px; background-color: #f3f6fb; color: #011478; border: 1px solid rgba(1, 20, 120, 0.15); cursor: pointer; transition: background-color 0.2s; font-family: inherit; }
        .btn-reason:hover { background-color: #e5e9f2; }
        .mobile-menu { display: none; position: relative; }
        .hamburger-btn { background: none; border: none; padding: 5px; cursor: pointer; display: flex; align-items: center; }
        .mobile-menu-content {
            display: none;
            position: absolute;
            right: 0;
            top: calc(100% + 5px);
            background-color: white;
            min-width: 140px;
            box-shadow: 0 8px 16px rgba(1, 20, 120, 0.1);
            z-index: 1001;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid rgba(1, 20, 120, 0.05);
        }
        .mobile-menu-content.show { display: block; }
        .mobile-menu-content a { color: #011478; padding: 12px 16px; text-decoration: none; display: block; font-size: 14px; font-weight: 500; }
        .mobile-menu-content a:hover { background-color: #f3f6fb; }

        #dashboard-screen.container {
            height: 100%;
            flex-direction: column;
        }
        #dashboard-screen .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            min-height: 0;
        }
        .table-container { flex: 1; overflow: auto; }
        .checkbox-label { display: flex; align-items: center; gap: 8px; cursor: pointer; }

        /* Mobile Responsive Styles */
        @media (max-width: 796px) {
            body { height: auto; overflow: auto; padding: 10px; }
            .container { border-radius: 20px; }
            #dashboard-screen.container { height: auto; }
            #dashboard-screen .content { display: block; padding: 20px 15px; }
            header { padding: 15px; position: relative; }
            header h1 { font-size: 24px; }
            header p { font-size: 13px; }
            .header-flex { justify-content: center; }
            .header-title-container { text-align: center; }
            .desktop-signout { display: none; }
            .mobile-menu { display: block; position: absolute; right: 15px; top: 15px; transform: none; }
            .stats-container {
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
            }
            .stats-container .stat-card:last-child {
                display: none;
            }
            .stat-card { padding: 12px; }
            .stat-card h3 { font-size: 9px; }
            .stat-card p { font-size: 18px; }
            .toolbar { flex-direction: column; gap: 10px; }
            .toolbar-actions { width: 100%; flex-wrap: nowrap; }
            .toolbar-actions > .toolbar-filter { flex-grow: 1; min-width: 60px; }
            .toolbar-actions > .btn-icon { flex-shrink: 0; }
            table { min-width: 850px; } /* Triggers horizontal swipe for the table */
            .modal-container { padding: 20px; width: 95%; max-height: 90vh; overflow-y: auto; }
        }
    </style>
</head>
<body>

    <!-- Login Screen -->
    <div id="login-screen" class="container" style="max-width: 400px; margin: 80px auto; display: none;">
        <header style="text-align: center; border-bottom: none; padding-bottom: 10px;">
            <h1>System Admin</h1>
            <p>Please authenticate to continue.</p>
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
            <div class="header-title-container">
                <h1>Admin Dashboard</h1>
                <p>Hotel at Home Bookings</p>
            </div>
            <button onclick="signOut()" class="btn-signout desktop-signout">Sign Out</button>
            <div class="mobile-menu">
                <button class="hamburger-btn" onclick="toggleMobileMenu(event)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                </button>
                <div id="mobile-menu-content" class="mobile-menu-content">
                    <a href="#" onclick="signOut(); return false;">Sign Out</a>
                </div>
            </div>
        </header>
        <div class="content">
            <!-- Statistics Dashboard -->
            <div class="stats-container">
                <div class="stat-card">
                    <h3>Total Bookings</h3>
                    <p id="stat-total">0</p>
                </div>
                <div class="stat-card">
                    <h3>Pending Approvals</h3>
                    <p id="stat-pending">0</p>
                </div>
                <div class="stat-card">
                    <h3>Confirmed Bookings</h3>
                    <p id="stat-confirmed">0</p>
                </div>
                <div class="stat-card">
                    <h3>Confirmed Revenue</h3>
                    <p id="stat-revenue">₱0</p>
                </div>
            </div>

            <!-- Controls / Toolbar -->
            <div class="toolbar">
                <input type="text" id="search-input" class="toolbar-search" placeholder="Search by Guest Name or Code..." oninput="handleFilter()">
                <div class="toolbar-actions">
                    <input type="month" id="filter-month" class="toolbar-filter" onchange="handleFilter()" title="Filter by Month">
                    <select id="filter-status" class="toolbar-filter" onchange="handleFilter()">
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <button onclick="openBlockDatesModal()" class="btn-export">Block Dates</button>
                    <button onclick="fetchBookings()" class="btn-icon" title="Refresh Logs"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v6h6M21 22v-6h-6"/><path d="M22 11.5A10 10 0 0 0 3.2 7.2M2 12.5a10 10 0 0 0 18.8 4.2"/></svg></button>
                    <button onclick="openExportModal()" class="btn-icon" title="Export CSV"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 3h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M4 9h18M10 3v18"/></svg></button>
                </div>
            </div>

            <div class="table-container">
                <table id="bookings-table">
                    <thead>
                        <tr>
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
                            <td colspan="8" id="loader">Loading bookings...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Action Modal -->
    <div id="action-modal" class="modal-overlay">
        <div class="modal-container">
            <h2 id="modal-title" class="modal-title">Update Status</h2>
            <p id="modal-desc" class="modal-desc">Enter details.</p>
            <textarea id="modal-reason" class="modal-textarea" placeholder="Type your message here..."></textarea>
            <div id="confirm-fields" style="display: none; margin-bottom: 24px;">
                <div style="margin-bottom: 15px;">
                    <label class="login-label">Payment Option</label>
                    <select id="modal-payment-option" class="login-input">
                        <option value="GCash">GCash</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                </div>
                <div>
                    <label class="login-label">Amount Received (₱)</label>
                    <input type="number" id="modal-amount" class="login-input" placeholder="0.00" min="0" step="0.01">
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn-modal btn-modal-cancel" onclick="closeActionModal()">Cancel</button>
                <button class="btn-modal btn-modal-submit" onclick="submitActionModal()">Send Update</button>
            </div>
        </div>
    </div>

    <!-- Block Dates Modal -->
    <div id="block-dates-modal" class="modal-overlay">
        <div class="modal-container" style="max-width: 500px;">
            <h2 class="modal-title">Block Dates</h2>
            <p class="modal-desc">Manually block dates for holidays or maintenance. This will appear as a confirmed "System Block" booking.</p>
            <div style="margin-bottom: 15px;">
                <label class="login-label">Room / Space</label>
                <select id="block-room" class="login-input">
                    <option value="1">Gold Room</option>
                    <option value="2">Blue Room</option>
                    <option value="3">Rooftop Lounge</option>
                </select>
            </div>
            <div style="display: flex; gap: 15px; margin-bottom: 15px;">
                <div style="flex: 1;"><label class="login-label">Start Date</label><input type="date" id="block-start" class="login-input" required></div>
                <div style="flex: 1;"><label class="login-label">End Date</label><input type="date" id="block-end" class="login-input" required></div>
            </div>
            <div style="margin-bottom: 24px;">
                <label class="login-label">Reason / Note</label>
                <input type="text" id="block-reason" class="login-input" placeholder="e.g. Unit Maintenance, Holiday">
            </div>
            <div class="modal-actions">
                <button class="btn-modal btn-modal-cancel" onclick="closeBlockDatesModal()">Cancel</button>
                <button class="btn-modal btn-modal-submit" onclick="submitBlockDates()">Block Dates</button>
            </div>
        </div>
    </div>

    <!-- Alert Modal -->
    <div id="alert-modal" class="modal-overlay">
        <div class="modal-container" style="max-width: 400px; text-align: center;">
            <h2 id="alert-title" class="modal-title">Alert</h2>
            <p id="alert-message" class="modal-desc" style="margin-bottom: 24px;">Message</p>
            <button class="btn-modal btn-modal-submit" style="width: 100%;" onclick="closeAlertModal()">OK</button>
        </div>
    </div>

    <!-- Contact Modal -->
    <div id="contact-modal" class="modal-overlay">
        <div class="modal-container" style="max-width: 550px;">
            <h2 class="modal-title">Contact Guest</h2>
            <p class="modal-desc">Choose a method to contact the guest.</p>
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14px; margin-bottom: 24px;">
                <thead>
                    <tr>
                        <th style="padding: 10px; border-bottom: 2px solid rgba(1,20,120,0.05); color: rgba(1,20,120,0.6); text-transform: uppercase; font-size: 12px;">Contact via</th>
                        <th style="padding: 10px; border-bottom: 2px solid rgba(1,20,120,0.05); color: rgba(1,20,120,0.6); text-transform: uppercase; font-size: 12px;">Contact Information</th>
                        <th style="padding: 10px; border-bottom: 2px solid rgba(1,20,120,0.05); color: rgba(1,20,120,0.6); text-transform: uppercase; font-size: 12px; text-align: right;">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 12px 10px; border-bottom: 1px solid rgba(1,20,120,0.05); font-weight: 600; color: #011478;">Email</td>
                        <td id="contact-email-text" style="padding: 12px 10px; border-bottom: 1px solid rgba(1,20,120,0.05); color: rgba(1,20,120,0.7);"></td>
                        <td style="padding: 12px 10px; border-bottom: 1px solid rgba(1,20,120,0.05); text-align: right;">
                            <a id="contact-email-btn" href="#" class="btn-modal btn-modal-submit" style="text-decoration: none; padding: 6px 16px; font-size: 12px; display: inline-block;">Email</a>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 10px; font-weight: 600; color: #011478;">Number</td>
                        <td id="contact-phone-text" style="padding: 12px 10px; color: rgba(1,20,120,0.7);"></td>
                        <td style="padding: 12px 10px; text-align: right;">
                            <a id="contact-phone-btn" href="#" class="btn-modal btn-modal-submit" style="text-decoration: none; padding: 6px 16px; font-size: 12px; display: inline-block;">Call</a>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="modal-actions">
                <button class="btn-modal btn-modal-cancel" onclick="closeContactModal()">Close</button>
            </div>
        </div>
    </div>

    <!-- Export CSV Modal -->
    <div id="export-modal" class="modal-overlay">
        <div class="modal-container" style="max-width: 500px;">
            <h2 class="modal-title">Export Bookings</h2>
            <p class="modal-desc">Select the date range and columns you want to include in the export.</p>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px;">
                <div style="flex: 1;">
                    <label class="login-label">Start Date</label>
                    <input type="date" id="export-start" class="login-input">
                </div>
                <div style="flex: 1;">
                    <label class="login-label">End Date</label>
                    <input type="date" id="export-end" class="login-input">
                </div>
            </div>
            <label class="login-label" style="margin-bottom: 10px;">Columns to Include</label>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; font-size: 14px;">
                <label class="checkbox-label"><input type="checkbox" class="export-col-cb" value="code" checked> Code</label>
                <label class="checkbox-label"><input type="checkbox" class="export-col-cb" value="room" checked> Room</label>
                <label class="checkbox-label"><input type="checkbox" class="export-col-cb" value="guest" checked> Guest Name</label>
                <label class="checkbox-label"><input type="checkbox" class="export-col-cb" value="check_in" checked> Check-in Date</label>
                <label class="checkbox-label"><input type="checkbox" class="export-col-cb" value="check_out" checked> Check-out Date</label>
                <label class="checkbox-label"><input type="checkbox" class="export-col-cb" value="status" checked> Status</label>
                <label class="checkbox-label"><input type="checkbox" class="export-col-cb" value="amount_paid" checked> Amount Paid</label>
                <label class="checkbox-label"><input type="checkbox" class="export-col-cb" value="total_price" checked> Total Price</label>
            </div>
            <div class="modal-actions">
                <button class="btn-modal btn-modal-cancel" onclick="closeExportModal()">Cancel</button>
                <button class="btn-modal btn-modal-submit" onclick="processExportCSV()">Download CSV</button>
            </div>
        </div>
    </div>

    <script>
        // --- CONFIGURATION ---
        // This should be your production backend URL
        const API_BASE_URL = 'https://hotelathomeph.com/api'; 
        
        let currentApiKey = sessionStorage.getItem('admin_pwd') || '';
        let allBookingsData = []; // Store raw bookings for search/filtering
        let filteredBookingsData = []; // Store current filtered list for exports and dashboard

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
                    allBookingsData = bookings;
                    handleFilter();
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

        function toggleMobileMenu(event) {
            event.stopPropagation();
            document.getElementById('mobile-menu-content').classList.toggle('show');
        }

        // Close the dropdown if the user clicks outside of it
        window.onclick = function(event) {
            if (!event.target.closest('.hamburger-btn')) {
                const dropdowns = document.getElementsByClassName("mobile-menu-content");
                for (let i = 0; i < dropdowns.length; i++) {
                    dropdowns[i].classList.remove('show');
                }
            }
        }

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
            document.getElementById('dashboard-screen').style.display = 'flex';
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
            tableBody.innerHTML = '<tr><td colspan="8" id="loader">Loading bookings...</td></tr>';

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
                allBookingsData = bookings;
                handleFilter();
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
                tableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 40px; color: #991b1b;">${errorMessage}</td></tr>`;
            });
        }

        function updateDashboardStats() {
            const data = filteredBookingsData;
            const total = data.length;
            const pending = data.filter(b => String(b.status).toLowerCase().trim() === 'pending').length;
            const confirmedBookings = data.filter(b => String(b.status).toLowerCase().trim() === 'confirmed');
            const confirmedCount = confirmedBookings.length;
            
            // Favor amount_paid if available in the database to calculate total exact revenue
            const revenue = confirmedBookings.reduce((sum, b) => sum + Number(b.amount_paid !== undefined && b.amount_paid !== null ? b.amount_paid : (b.total_price || 0)), 0);

            document.getElementById('stat-total').textContent = total;
            document.getElementById('stat-pending').textContent = pending;
            document.getElementById('stat-confirmed').textContent = confirmedCount;
            document.getElementById('stat-revenue').textContent = '₱' + revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }

        function renderTable() {
            const tableBody = document.getElementById('bookings-tbody');
            tableBody.innerHTML = ''; // Clear loader/old data

            if (filteredBookingsData.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px;">No bookings found.</td></tr>';
                return;
            }

            filteredBookingsData.forEach(booking => {
                const status = String(booking.status).toLowerCase().trim();
                const isConfirmed = status === 'confirmed';
                const isCancelled = status === 'cancelled';

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><strong>${booking.confirmation_code}</strong></td>
                    <td>${roomNames[booking.room_id] || 'Unknown'}</td>
                    <td>${booking.guest_first_name} ${booking.guest_last_name}</td>
                    <td>${new Date(booking.check_in).toLocaleDateString()}</td>
                    <td>${new Date(booking.check_out).toLocaleDateString()}</td>
                    <td>₱${Number(booking.total_price).toLocaleString()}</td>
                    <td><span class="status status-${status}">${booking.status}</span></td>
                    <td>
                        <div class="action-group">
                            <button class="btn-action confirm" onclick="openActionModal(${booking.id}, 'confirmed')" ${(isConfirmed || isCancelled) ? 'disabled' : ''}>Confirm</button>
                            <button class="btn-action cancel" onclick="openActionModal(${booking.id}, 'cancelled')" ${isCancelled ? 'disabled' : ''}>Cancel</button>
                            <button class="btn-action contact" onclick="openContactModal(${booking.id})">Contact</button>
                        </div>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        }

        function handleFilter() {
            const searchTerm = document.getElementById('search-input').value.toLowerCase();
            const statusFilter = document.getElementById('filter-status').value;
            const monthFilter = document.getElementById('filter-month').value;

            filteredBookingsData = allBookingsData.filter(b => {
                const bStatus = String(b.status).toLowerCase().trim();
                const matchesSearch = (b.confirmation_code && b.confirmation_code.toLowerCase().includes(searchTerm)) ||
                                    (b.guest_first_name && b.guest_first_name.toLowerCase().includes(searchTerm)) ||
                                    (b.guest_last_name && b.guest_last_name.toLowerCase().includes(searchTerm));
                const matchesStatus = statusFilter === 'all' || bStatus === statusFilter;
                
                let matchesMonth = true;
                if (monthFilter && b.check_in) {
                    matchesMonth = b.check_in.substring(0, 7) === monthFilter;
                }
                
                return matchesSearch && matchesStatus && matchesMonth;
            });

            updateDashboardStats();
            renderTable();
        }

        let pendingActionBookingId = null;
        let pendingActionStatus = null;

        function openActionModal(bookingId, newStatus) {
            pendingActionBookingId = bookingId;
            pendingActionStatus = newStatus;
            
            const booking = allBookingsData.find(b => b.id === bookingId);
            const guestEmail = booking && booking.guest_email ? ` (${booking.guest_email})` : '';

            const titleEl = document.getElementById('modal-title');
            const descEl = document.getElementById('modal-desc');
            const textareaEl = document.getElementById('modal-reason');
            const confirmFieldsEl = document.getElementById('confirm-fields');
            
            if (newStatus === 'cancelled') {
                const guestName = booking.guest_first_name || 'Guest';
                const bookingCode = booking.confirmation_code || 'N/A';
                
                titleEl.textContent = 'Cancel Booking';
                descEl.textContent = 'Review the cancellation message. This will be sent to the guest via email.';
                textareaEl.style.display = 'block';
                confirmFieldsEl.style.display = 'none';
                
                textareaEl.value = `Dear ${guestName},\n\nWe regret to inform you that your booking with reference code ${bookingCode} has been cancelled.\n\nThis could be due to issues with payment verification, unavailability of dates, or at your request. If you believe this is a mistake or would like to rebook, please contact us immediately.\n\nThank you for considering us.\n\nHotel at Home Team\n+63 927 858 4938  |  +63 917 887 6444`;
            } else {
                titleEl.textContent = 'Confirm Booking';
                descEl.textContent = `Are you sure you want to confirm this booking? An automated email will be sent to the guest${guestEmail}.`;
                textareaEl.style.display = 'none';
                confirmFieldsEl.style.display = 'block';
                
                textareaEl.value = ''; // Clear input for confirm mode
                document.getElementById('modal-amount').value = booking.total_price || '';
            }
            
            document.getElementById('action-modal').style.display = 'flex';
            if (newStatus === 'cancelled') textareaEl.focus();
        }

        function setReason(text) {
            document.getElementById('modal-reason').value = text;
        }

        function closeActionModal() {
            document.getElementById('action-modal').style.display = 'none';
            pendingActionBookingId = null;
            pendingActionStatus = null;
        }

        function openBlockDatesModal() {
            document.getElementById('block-start').value = '';
            document.getElementById('block-end').value = '';
            document.getElementById('block-reason').value = '';
            document.getElementById('block-dates-modal').style.display = 'flex';
        }

        function closeBlockDatesModal() {
            document.getElementById('block-dates-modal').style.display = 'none';
        }

        function submitBlockDates() {
            const roomId = document.getElementById('block-room').value;
            const checkIn = document.getElementById('block-start').value;
            const checkOut = document.getElementById('block-end').value;
            const reason = document.getElementById('block-reason').value.trim() || 'Manual Block';

            if (!checkIn || !checkOut) { showAlert('Input Required', 'Please provide both start and end dates.'); return; }
            if (checkIn >= checkOut) { showAlert('Invalid Dates', 'End date must be after the start date.'); return; }

            closeBlockDatesModal();
            const tableBody = document.getElementById('bookings-tbody');
            tableBody.innerHTML = '<tr><td colspan="8" id="loader">Blocking dates...</td></tr>';

            fetch(`${API_BASE_URL}/admin/block-dates`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-api-key': currentApiKey },
                body: JSON.stringify({ roomId, checkIn, checkOut, reason })
            })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 401) { signOut(); throw new Error('Session expired'); }
                    return response.json().then(data => { throw new Error(data.error || 'Failed to block dates.'); });
                }
                return response.json();
            })
            .then(data => { if (data.success) { showAlert('Success', 'Dates have been successfully blocked.'); } fetchBookings(); })
            .catch(error => {
                console.error('Error blocking dates:', error);
                if (currentApiKey) showAlert('Error', error.message || 'An error occurred while blocking dates.');
                fetchBookings();
            });
        }

        function openContactModal(bookingId) {
            const booking = allBookingsData.find(b => b.id === bookingId);
            if (!booking) return;

            const email = booking.guest_email || 'Not provided';
            const phone = booking.guest_phone || 'Not provided';

            document.getElementById('contact-email-text').textContent = email;
            document.getElementById('contact-phone-text').textContent = phone;
            
            const emailBtn = document.getElementById('contact-email-btn');
            if (booking.guest_email) {
                emailBtn.href = `mailto:${booking.guest_email}`;
                emailBtn.style.display = 'inline-block';
            } else {
                emailBtn.style.display = 'none';
            }

            const phoneBtn = document.getElementById('contact-phone-btn');
            if (booking.guest_phone) {
                phoneBtn.href = `tel:${booking.guest_phone}`;
                phoneBtn.style.display = 'inline-block';
            } else {
                phoneBtn.style.display = 'none';
            }
            
            document.getElementById('contact-modal').style.display = 'flex';
        }

        function closeContactModal() {
            document.getElementById('contact-modal').style.display = 'none';
        }

        function showAlert(title, message) {
            document.getElementById('alert-title').textContent = title;
            document.getElementById('alert-message').textContent = message;
            document.getElementById('alert-modal').style.display = 'flex';
        }

        function closeAlertModal() {
            document.getElementById('alert-modal').style.display = 'none';
        }

        function submitActionModal() {
            if (!pendingActionBookingId || !pendingActionStatus) return;
            
            const reason = document.getElementById('modal-reason').value.trim();
            const bookingId = pendingActionBookingId;
            const newStatus = pendingActionStatus;

            let amountPaid = null;
            let paymentOption = null;

            // Prevent empty submissions
            if (newStatus === 'cancelled' && !reason) {
                showAlert('Input Required', 'Please enter a reason for cancellation to send to the guest.');
                return;
            }
            
            if (newStatus === 'confirmed') {
                amountPaid = document.getElementById('modal-amount').value;
                paymentOption = document.getElementById('modal-payment-option').value;
                if (amountPaid === '' || amountPaid < 0) {
                    showAlert('Input Required', 'Please enter a valid amount received.');
                    return;
                }
            }
            
            closeActionModal(); // Hide modal

            // Set loading state on the page
            const tableBody = document.getElementById('bookings-tbody');
            tableBody.innerHTML = '<tr><td colspan="8" id="loader">Processing update and securing dates...</td></tr>';

            const payload = { 
                status: newStatus,
                send_email: true 
            };
            
            if (newStatus === 'cancelled') {
                payload.email_message = reason;
            } else if (newStatus === 'confirmed') {
                payload.amount_paid = parseFloat(amountPaid);
                payload.payment_option = paymentOption;
            }

            fetch(`${API_BASE_URL}/admin/bookings/${bookingId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': currentApiKey
                },
                body: JSON.stringify(payload)
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
                    // Refreshing fetches new data, updates calendar constraints globally
                    fetchBookings(); 
                } else {
                    showAlert('Update Failed', 'Failed to update status: ' + (data.error || 'Unknown error'));
                    fetchBookings(); // Reload to original state
                }
            })
            .catch(error => {
                console.error('Error updating status:', error);
                if (currentApiKey) showAlert('Error', 'An error occurred while updating the status.');
                fetchBookings();
            });
        }

        function openExportModal() {
            document.getElementById('export-modal').style.display = 'flex';
        }

        function closeExportModal() {
            document.getElementById('export-modal').style.display = 'none';
        }

        function processExportCSV() {
            const startDate = document.getElementById('export-start').value;
            const endDate = document.getElementById('export-end').value;

            const selectedCols = [];
            document.querySelectorAll('.export-col-cb:checked').forEach(cb => selectedCols.push(cb.value));
            
            if (selectedCols.length === 0) {
                showAlert('Export Error', 'Please select at least one column to export.');
                return;
            }

            let dataToExport = allBookingsData;

            // Apply Date Filters
            if (startDate) dataToExport = dataToExport.filter(b => b.check_in >= startDate);
            if (endDate) dataToExport = dataToExport.filter(b => b.check_in <= endDate);

            if (dataToExport.length === 0) {
                showAlert('Export Error', 'No bookings found for the selected dates.');
                return;
            }
            
            const colLabels = { code: 'Code', room: 'Room', guest: 'Guest', check_in: 'Check-in', check_out: 'Check-out', amount_paid: 'Amount Paid (PHP)', total_price: 'Total (PHP)', status: 'Status' };
            const colMap = {
                'code': b => b.confirmation_code,
                'room': b => roomNames[b.room_id] || 'Unknown',
                'guest': b => `"${b.guest_first_name} ${b.guest_last_name}"`,
                'check_in': b => b.check_in,
                'check_out': b => b.check_out,
                'amount_paid': b => b.amount_paid !== undefined && b.amount_paid !== null ? b.amount_paid : '',
                'total_price': b => b.total_price,
                'status': b => b.status
            };

            const csvRows = [selectedCols.map(c => colLabels[c]).join(',')];
            let totalAmountPaid = 0;
            let totalRevenue = 0;
            
            dataToExport.forEach(b => {
                const row = selectedCols.map(c => colMapc);
                csvRows.push(row.join(','));
                
                if (String(b.status).toLowerCase().trim() === 'confirmed') {
                    totalAmountPaid += Number(b.amount_paid !== undefined && b.amount_paid !== null ? b.amount_paid : 0);
                    totalRevenue += Number(b.total_price || 0);
                }
            });

            // Add a revenue summary row if revenue metrics were included in the export
            if (selectedCols.includes('amount_paid') || selectedCols.includes('total_price')) {
                const summaryRow = selectedCols.map((c, index) => {
                    if (index === 0) return '"CONFIRMED REVENUE TOTAL"';
                    if (c === 'amount_paid') return totalAmountPaid;
                    if (c === 'total_price') return totalRevenue;
                    return '';
                });
                csvRows.push(summaryRow.join(','));
            }

            let filename = 'bookings_export';
            if (startDate && endDate) filename += `_${startDate}_to_${endDate}`;
            else if (startDate) filename += `_from_${startDate}`;
            else if (endDate) filename += `_until_${endDate}`;
            else filename += `_all_time`;

            const csvString = csvRows.join('\n');
            const blob = new Blob([csvString], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${filename}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
            
            closeExportModal();
        }
    </script>

</body>
</html>