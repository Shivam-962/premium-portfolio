const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const nodemailer = require('nodemailer');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'premium_portfolio_secret_key_2026_local';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Temporary memory store for OTP verification if SQL is mock or SMTP is offline
const tempOtpStore = {};

// Helper to create transport for Nodemailer
function getMailTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host: host,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: { user, pass }
  });
}

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Please provide username and password.' });
    }

    // Fetch user from DB
    const users = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const user = users[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    // Generate 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Store OTP in database or in memory fallback
    if (db.isMock()) {
      tempOtpStore[user.username] = { otpCode, expires };
    } else {
      await db.query('UPDATE users SET otp_code = ?, otp_expires = ? WHERE id = ?', [otpCode, expires, user.id]);
    }

    console.log(`\n🔑 [OTP SECURITY CODE GENERATED]: ${otpCode} (Expires in 10 mins)`);

    // Send OTP via SMTP if credentials are configured
    const transporter = getMailTransporter();
    let sentEmail = false;
    if (transporter) {
      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || 'noreply@premiumportfolio.local',
          to: user.email,
          subject: 'Your Portfolio Security OTP Code',
          text: `Your login OTP code is: ${otpCode}. It will expire in 10 minutes.`,
          html: `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2>Portfolio Security OTP</h2>
            <p>Your verification code is: <strong style="font-size: 20px; letter-spacing: 2px; color: #2563EB;">${otpCode}</strong></p>
            <p>This code will expire in 10 minutes.</p>
          </div>`
        });
        sentEmail = true;
      } catch (err) {
        console.error('Failed to send OTP email via SMTP:', err.message);
      }
    }

    return res.json({
      success: true,
      message: 'OTP Code generated. Verification required.',
      username: user.username,
      email: user.email,
      // For local testing convenience (if email isn't configured, user can see the OTP in payload/console)
      otpMock: !sentEmail ? otpCode : null,
      emailSent: sentEmail
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'An error occurred during login.' });
  }
};

exports.verifyOtp = async (req, res) => {
  const { username, otpCode } = req.body;

  try {
    if (!username || !otpCode) {
      return res.status(400).json({ success: false, message: 'Please provide username and OTP code.' });
    }

    let user = null;
    let isValid = false;

    if (db.isMock()) {
      const users = await db.query('SELECT * FROM users WHERE username = ?', [username]);
      user = users[0];
      const savedOtp = tempOtpStore[username];
      if (user && savedOtp && savedOtp.otpCode === otpCode && savedOtp.expires > new Date()) {
        isValid = true;
        delete tempOtpStore[username]; // Clear OTP
      }
    } else {
      const users = await db.query('SELECT * FROM users WHERE username = ?', [username]);
      user = users[0];
      if (user && user.otp_code === otpCode && new Date(user.otp_expires) > new Date()) {
        isValid = true;
        // Clear OTP in DB
        await db.query('UPDATE users SET otp_code = NULL, otp_expires = NULL WHERE id = ?', [user.id]);
      }
    }

    if (!isValid || !user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP code.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.json({
      success: true,
      token: `Bearer ${token}`,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        title: user.title,
        email: user.email,
        bio: user.bio,
        location: user.location,
        profile_image: user.profile_image
      }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ success: false, message: 'An error occurred during verification.' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const users = await db.query('SELECT id, username, email, role, full_name, title, bio, location, profile_image FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'Profile not found.' });
    }
    return res.json({
      success: true,
      user: users[0]
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'An error occurred fetching profile.' });
  }
};

exports.updateProfile = async (req, res) => {
  const { full_name, title, bio, location, profile_image } = req.body;

  try {
    if (db.isMock()) {
      const users = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
      if (users.length === 0) {
        return res.status(404).json({ success: false, message: 'Profile not found.' });
      }
      const u = users[0];
      if (full_name) u.full_name = full_name;
      if (title) u.title = title;
      if (bio) u.bio = bio;
      if (location) u.location = location;
      if (profile_image) u.profile_image = profile_image;
    } else {
      await db.query(
        'UPDATE users SET full_name = ?, title = ?, bio = ?, location = ?, profile_image = ? WHERE id = ?',
        [full_name, title, bio, location, profile_image, req.user.id]
      );
    }

    return res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: req.user.id,
        username: req.user.username,
        full_name,
        title,
        bio,
        location,
        profile_image
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'An error occurred updating profile.' });
  }
};
