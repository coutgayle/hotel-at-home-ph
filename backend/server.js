require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();

// Trust proxy is useful for environments behind reverse proxies (like Hostinger/Railway)
app.set('trust proxy', 1);

// Middleware
// Configured CORS to restrict to your production domain and local development
const allowedOrigins = [
  'https://hotelathomeph.com',
  'https://www.hotelathomeph.com',
  'http://localhost:3000'
];
if (process.env.FRONTEND_URL) allowedOrigins.push(process.env.FRONTEND_URL);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
})); 
app.use(express.json()); // Parses incoming JSON requests

// Email Transporter Setup
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this to Hostinger's SMTP if preferred
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Basic Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Hotel at Home Backend is running!' });
});

// --- API ROUTES ---

// 1. Get all rooms
app.get('/api/rooms', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM rooms');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// 2. Create a new booking
app.post('/api/bookings', async (req, res) => {
  try {
    const {
      roomId, guestFirstName, guestLastName, guestEmail, guestPhone,
      checkIn, checkOut, totalPrice, purpose, guests
    } = req.body;

    // --- OVERLAP VALIDATION ---
    // Check if the chosen dates have been booked by someone else
    // If Gold or Blue room is selected, also check if the Rooftop Lounge (ID 3) is already booked
    let overlapQuery = "SELECT id FROM bookings WHERE (room_id = ? OR room_id = 3) AND status != 'cancelled' AND check_in < ? AND check_out > ?";
    let overlapParams = [roomId, checkOut, checkIn];

    // If Rooftop Lounge (ID 3), check if ANY room is booked during these dates
    if (parseInt(roomId) === 3) {
      overlapQuery = "SELECT id FROM bookings WHERE status != 'cancelled' AND check_in < ? AND check_out > ?";
      overlapParams = [checkOut, checkIn];
    }

    const [overlaps] = await pool.query(overlapQuery, overlapParams);
    if (overlaps.length > 0) {
      return res.status(400).json({ error: 'These dates have just been booked. Please select different dates.' });
    }

    // Generate a random confirmation code (e.g., HH-A1B2C3)
    const confirmationCode = 'HH-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    // Safe fallback in case a room like Rooftop Lounge has a null/TBA price
    const finalPrice = totalPrice || 0;

    const [result] = await pool.query(
      `INSERT INTO bookings 
      (confirmation_code, room_id, guest_first_name, guest_last_name, guest_email, guest_phone, check_in, check_out, total_price, purpose) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [confirmationCode, roomId, guestFirstName, guestLastName, guestEmail, guestPhone, checkIn, checkOut, finalPrice, purpose || null]
    );

    // Send Email Notifications (Async, so it doesn't block the response if it fails)
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const isRooftop = parseInt(roomId) === 3;

        let roomName = 'Unknown Room';
        if (parseInt(roomId) === 1) roomName = 'Gold Room';
        else if (parseInt(roomId) === 2) roomName = 'Blue Room';
        else if (parseInt(roomId) === 3) roomName = 'Rooftop Lounge';
        
        const mailOptionsAdmin = {
          from: process.env.EMAIL_USER,
          to: 'hotelathome.ph@gmail.com', // Admin Email
          subject: `New Booking Received: ${confirmationCode}`,
          text: `A new booking has been made!\n\nConfirmation Code: ${confirmationCode}\nRoom ID: ${roomId} (${roomName})\nGuest: ${guestFirstName} ${guestLastName}\nEmail: ${guestEmail}\nPhone: ${guestPhone}\nCheck-in: ${checkIn}\nCheck-out: ${checkOut}\nGuests: ${guests || 1}\nTotal Price: ₱${totalPrice}\nPurpose/Notes: ${purpose || 'N/A'}`
        };
        
        const mailOptionsGuest = {
          from: process.env.EMAIL_USER,
          to: guestEmail,
          subject: `Booking Confirmation – Hotel At Home`,
          text: `Hi ${guestFirstName},\n\nThank you for booking with Hotel at Home. We are pleased to confirm your reservation.\n\nHere are your booking details for reference:\nRoom Type: ${roomName}\nCheck-in: ${checkIn}${parseInt(roomId) !== 3 ? ' at 2:00 PM' : ''}\nCheck-out: ${checkOut}${parseInt(roomId) !== 3 ? ' at 12:00 PM' : ''}\nGuests: ${guests || 1}\nConfirmation Code: ${confirmationCode}\nPurpose/Notes: ${purpose || 'N/A'}\n\nFor a smooth stay, kindly review our House Rules here: https://hotelathomeph.com/info/\n\nA separate message with additional check-in instructions will be sent prior to your arrival date.\n\nIf you have any questions, please feel free to contact us via email or Viber. We'll be happy to assist and make your stay as comfortable as possible.\n\nThank you, and we look forward to hosting you.\n\nBest regards,\nHotel at Home Team\n+63 927 858 4938\n+63 917 887 6444`
        };
        
        await transporter.sendMail(mailOptionsAdmin);
        await transporter.sendMail(mailOptionsGuest);
      }
    } catch (emailError) {
      console.error('Failed to send confirmation emails:', emailError);
    }

    res.status(201).json({ success: true, confirmationCode, bookingId: result.insertId });
  } catch (error) {
    console.error('Error creating booking:', error);
    // Expose the exact database error so we know exactly what is failing
    res.status(500).json({ error: error.message || 'Database error occurred' });
  }
});

// 3. Get a booking by confirmation code
app.get('/api/bookings/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email address is required to view your booking.' });
    }

    const [rows] = await pool.query('SELECT * FROM bookings WHERE confirmation_code = ? AND guest_email = ?', [code, email]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found or email does not match.' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// 4. Get blocked dates for a specific room
app.get('/api/bookings/dates/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    
    // If Gold or Blue room is selected, fetch dates where this room OR the Rooftop Lounge is booked
    let query = "SELECT check_in, check_out FROM bookings WHERE (room_id = ? OR room_id = 3) AND status != 'cancelled'";
    let queryParams = [roomId];

    // If Rooftop Lounge (ID 3) is selected, block dates if Gold (1), Blue (2), or Rooftop (3) is booked
    if (parseInt(roomId) === 3) {
      query = "SELECT check_in, check_out FROM bookings WHERE status != 'cancelled'";
      queryParams = [];
    }

    const [rows] = await pool.query(query, queryParams);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching blocked dates:', error);
    res.status(500).json({ error: 'Failed to fetch dates' });
  }
});

// 5. Debug route to verify Hostinger paths
app.get('/api/debug', (req, res) => {
  const fs = require('fs');
  const rootDir = __dirname.endsWith('backend') ? path.resolve(__dirname, '..') : process.cwd();
  const frontendPath = path.join(rootDir, 'frontend', 'out');
  res.json({
    status: 'running',
    rootDir: rootDir,
    dirname: __dirname,
    frontendExists: fs.existsSync(frontendPath),
    files: fs.existsSync(frontendPath) ? fs.readdirSync(frontendPath) : 'Missing'
  });
});

// --- SERVE FRONTEND WEBSITE ---
// Use absolute path to bypass Hostinger pathing issues
const rootDir = __dirname.endsWith('backend') ? path.resolve(__dirname, '..') : process.cwd();
const frontendOutPath = path.join(rootDir, 'frontend', 'out');
app.use(express.static(frontendOutPath, { extensions: ['html'] }));

// Catch-all handler for 404 Not Found (Next.js is a Multi-Page Application)
app.get('*', (req, res) => {
  const fs = require('fs');
  
  // Catch trailing slashes and direct matches to ensure Next.js pages load reliably
  let requestedPath = req.path;
  // If path is like /view-booking/, try to find /view-booking/index.html
  if (requestedPath.endsWith('/') && requestedPath.length > 1) {
    requestedPath = requestedPath.slice(0, -1);
  }

  const targetHtmlFile = path.join(frontendOutPath, requestedPath, 'index.html'); // e.g., /view-booking/index.html
  const targetRootFile = path.join(frontendOutPath, `${requestedPath}.html`); // e.g., /view-booking.html (fallback)
  
  if (fs.existsSync(targetHtmlFile)) {
    return res.sendFile(targetHtmlFile);
  } else if (fs.existsSync(targetRootFile)) { // For root files like 404.html if directly requested
    return res.sendFile(targetRootFile);
  }
  
  const notFoundPath = path.join(frontendOutPath, '404.html');
  res.status(404).sendFile(notFoundPath, (err) => {
    if (err) {
      console.error('404 file missing:', err);
      res.status(404).send('<div style="font-family: sans-serif; text-align: center; margin-top: 50px;"><h2>Page Not Found</h2><p>This page does not exist or the deployment is still updating.</p><a href="/" style="color: #011478; text-decoration: underline;">Return Home</a></div>');
    }
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});