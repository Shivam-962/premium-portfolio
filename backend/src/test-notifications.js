const nodemailer = require('nodemailer');
require('dotenv').config();

console.log("=== Testing Notifications Setup ===");
console.log(`Owner Email: ${process.env.OWNER_EMAIL || 'shivaartist962@gmail.com'}`);
console.log(`Owner Phone: ${process.env.OWNER_PHONE || '+919175141111'}`);

// Test Email Transporter
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

async function runTest() {
  const name = "Test Visitor";
  const email = "visitor@test.com";
  const subject = "Urgent Inquiry Test";
  const message = "This is a test notification message from the test-notifications script to verify your email and SMS notification configuration.";

  const transporter = getMailTransporter();
  if (transporter) {
    console.log("SMTP configured. Sending test email...");
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@premiumportfolio.local',
        to: process.env.OWNER_EMAIL || process.env.SMTP_USER || 'shivaartist962@gmail.com',
        subject: `[TEST] Portfolio Contact: ${subject}`,
        text: `Test message from ${name} (${email}):\n\n${message}`
      });
      console.log("📧 Test email sent successfully!");
    } catch (err) {
      console.error("❌ Email test failed:", err.message);
    }
  } else {
    console.log("⚠️ SMTP not fully configured in .env (SMTP_USER/PASS/HOST missing). Skipping email send.");
  }

  // SMS
  const toPhone = process.env.OWNER_PHONE || '+919175141111';
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
  const fast2smsKey = process.env.FAST2SMS_API_KEY;
  const smsText = `Portfolio inquiry test from ${name} (${email}): ${subject}`;

  console.log(`Sending SMS to: ${toPhone}...`);

  if (twilioSid && twilioToken && twilioPhone) {
    console.log("Using Twilio to send SMS...");
    try {
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

      const resData = await response.json();
      if (response.ok) {
        console.log(`📱 Twilio SMS sent successfully! SID: ${resData.sid}`);
      } else {
        console.error("❌ Twilio SMS failed:", resData);
      }
    } catch (err) {
      console.error("❌ Twilio error:", err.message);
    }
  } else if (fast2smsKey) {
    console.log("Using Fast2SMS to send SMS...");
    try {
      const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${fast2smsKey}&route=q&message=${encodeURIComponent(smsText)}&language=english&flash=0&numbers=${toPhone.replace('+', '')}`;
      const response = await fetch(url);
      const resData = await response.json();
      if (response.ok && resData.return) {
        console.log(`📱 Fast2SMS sent successfully!`);
      } else {
        console.error("❌ Fast2SMS failed:", resData);
      }
    } catch (err) {
      console.error("❌ Fast2SMS error:", err.message);
    }
  } else {
    console.log(`\n📱 [MOCK SMS ALERT SENT TO ${toPhone}]:\nContent: ${smsText}\n`);
  }
}

runTest();
