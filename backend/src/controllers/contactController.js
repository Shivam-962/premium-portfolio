const db = require('../config/db');
const nodemailer = require('nodemailer');
require('dotenv').config();

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

exports.sendMessage = async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All contact fields are required.' });
    }

    // Save message to MySQL
    const result = await db.query(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [name, email, subject, message]
    );

    console.log(`\n📧 [NEW CONTACT MESSAGE RECEIVED]:\nFrom: ${name} (${email})\nSubject: ${subject}\nMessage: ${message}\n`);

    // Dispatch email alert to portfolio owner via SMTP
    const transporter = getMailTransporter();
    if (transporter) {
      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || 'noreply@premiumportfolio.local',
          to: process.env.OWNER_EMAIL || process.env.SMTP_USER || 'shivaartist962@gmail.com', // Send to owner
          replyTo: email,
          subject: `Portfolio Contact: ${subject}`,
          text: `You received a new message from ${name} (${email}):\n\n${message}`,
          html: `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px; max-width: 600px;">
            <h2 style="color: #2563EB; border-bottom: 1px solid #eee; padding-bottom: 10px;">New Portfolio Inquiry</h2>
            <p><strong>From:</strong> ${name} (<a href="mailto:${email}">${email}</a>)</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 15px; white-space: pre-wrap;">
              ${message}
            </div>
          </div>`
        });
        console.log(`📧 Notification email successfully sent to ${process.env.OWNER_EMAIL || process.env.SMTP_USER || 'shivaartist962@gmail.com'}`);
      } catch (err) {
        console.error('Failed to dispatch contact alert email:', err.message);
      }
    }

    // Dispatch SMS alert to portfolio owner via Twilio, Fast2SMS, or Mock console logging
    const toPhone = process.env.OWNER_PHONE || '+919175141111';
    let smsSent = false;
    let smsMethod = 'none';

    try {
      const twilioSid = process.env.TWILIO_ACCOUNT_SID;
      const twilioToken = process.env.TWILIO_AUTH_TOKEN;
      const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
      const fast2smsKey = process.env.FAST2SMS_API_KEY;
      const smsText = `Portfolio inquiry from ${name} (${email}): ${subject}. Msg: ${message.substring(0, 100)}`;

      if (twilioSid && twilioToken && twilioPhone) {
        const url = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;
        const auth = Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64');
        const params = new URLSearchParams();
        params.append('To', toPhone);
        params.append('From', twilioPhone);
        params.append('Body', smsText);

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: params.toString()
        });

        if (response.ok) {
          smsSent = true;
          smsMethod = 'Twilio';
          console.log(`📱 Twilio SMS alert sent successfully to ${toPhone}`);
        } else {
          const errData = await response.json();
          console.error('Twilio SMS sending failed:', errData);
        }
      } else if (fast2smsKey) {
        const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${fast2smsKey}&route=q&message=${encodeURIComponent(smsText.substring(0, 120))}&language=english&flash=0&numbers=${toPhone.replace('+', '')}`;
        const response = await fetch(url);
        
        if (response.ok) {
          const resData = await response.json();
          if (resData.return) {
            smsSent = true;
            smsMethod = 'Fast2SMS';
            console.log(`📱 Fast2SMS alert sent successfully to ${toPhone}`);
          } else {
            console.error('Fast2SMS returned error:', resData);
          }
        } else {
          console.error('Fast2SMS HTTP request failed');
        }
      }

      if (!smsSent) {
        console.log(`\n📱 [MOCK SMS ALERT SENT TO ${toPhone}]:\nContent: ${smsText}\n`);
      }
    } catch (smsErr) {
      console.error('SMS notification error:', smsErr.message);
    }

    res.json({
      success: true,
      message: 'Message sent successfully. Thank you!',
      messageId: result.insertId
    });
  } catch (error) {
    console.error('sendMessage error:', error);
    res.status(500).json({ success: false, message: 'Failed to send message. Please try again.' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await db.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json({ success: true, data: messages });
  } catch (error) {
    console.error('getMessages error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve messages.' });
  }
};

exports.markAsRead = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('UPDATE contact_messages SET is_read = 1 WHERE id = ?', [id]);
    res.json({ success: true, message: 'Message marked as read.' });
  } catch (error) {
    console.error('markAsRead error:', error);
    res.status(500).json({ success: false, message: 'Failed to update message status.' });
  }
};
