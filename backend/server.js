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
      checkIn, checkOut, totalPrice, purpose
    } = req.body;

    // --- OVERLAP VALIDATION ---
    // Check if the chosen dates have been booked by someone else
    // If Gold or Blue room is selected, also check if the Rooftop Lounge (ID 3) is already booked
    let overlapQuery = "SELECT id FROM bookings WHERE (room_id = ? OR room_id = 3) AND status != 'Cancelled' AND check_in < ? AND check_out > ?";
    let overlapParams = [roomId, checkOut, checkIn];

    // If Rooftop Lounge (ID 3), check if ANY room is booked during these dates
    if (parseInt(roomId) === 3) {
      overlapQuery = "SELECT id FROM bookings WHERE status != 'Cancelled' AND check_in < ? AND check_out > ?";
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
        
        const mailOptionsAdmin = {
          from: process.env.EMAIL_USER,
          to: 'hotelathome.ph@gmail.com', // Admin Email
          subject: isRooftop ? `New Rooftop Inquiry: ${confirmationCode}` : `New Booking Received: ${confirmationCode}`,
          text: isRooftop 
            ? `A new Rooftop Lounge inquiry has been made!\n\nInquiry Code: ${confirmationCode}\nGuest: ${guestFirstName} ${guestLastName}\nEmail: ${guestEmail}\nPhone: ${guestPhone}\nCheck-in: ${checkIn}\nCheck-out: ${checkOut}\nPurpose: ${purpose}\n\nPlease review this in your dashboard.`
            : `A new booking has been made!\n\nConfirmation Code: ${confirmationCode}\nRoom ID: ${roomId}\nGuest: ${guestFirstName} ${guestLastName}\nEmail: ${guestEmail}\nPhone: ${guestPhone}\nCheck-in: ${checkIn}\nCheck-out: ${checkOut}\nTotal Price: ₱${totalPrice}`
        };
        
        const mailOptionsGuest = {
          from: process.env.EMAIL_USER,
          to: guestEmail,
          subject: isRooftop ? `Your Rooftop Inquiry: ${confirmationCode}` : `Your Booking Confirmation: ${confirmationCode}`,
          text: isRooftop
            ? `Dear ${guestFirstName},\n\nThank you for inquiring about the Rooftop Lounge at Hotel at Home!\n\nYour inquiry code is: ${confirmationCode}\nCheck-in: ${checkIn}\nCheck-out: ${checkOut}\nEvent Purpose: ${purpose}\n\nOur team will review your request and contact you shortly regarding pricing, setup, and approval.\n\nBest regards,\nHotel at Home Team`
            : `Dear ${guestFirstName},\n\nThank you for booking with Hotel at Home!\n\nYour confirmation code is: ${confirmationCode}\nCheck-in: ${checkIn}\nCheck-out: ${checkOut}\nTotal: ₱${totalPrice}\n\nPlease keep this code to check your booking status on our website.\n\nBest regards,\nHotel at Home Team`
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
    const [rows] = await pool.query('SELECT * FROM bookings WHERE confirmation_code = ?', [code]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
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
    let query = "SELECT check_in, check_out FROM bookings WHERE (room_id = ? OR room_id = 3) AND status != 'Cancelled'";
    let queryParams = [roomId];

    // If Rooftop Lounge (ID 3) is selected, block dates if Gold (1), Blue (2), or Rooftop (3) is booked
    if (parseInt(roomId) === 3) {
      query = "SELECT check_in, check_out FROM bookings WHERE status != 'Cancelled'";
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

// Catch-all handler to ensure client-side routing works for Next.js
app.get('*', (req, res) => {
  const indexPath = path.join(frontendOutPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Frontend file missing:', err);
      res.status(500).send('<div style="font-family: sans-serif; text-align: center; margin-top: 50px;"><h2>Deployment Updating...</h2><p>The backend is active but the frontend files are missing. If you just deployed, wait 2 minutes.</p></div>');
    }
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});