const nodemailer = require('nodemailer');

/**
 * Configure Nodemailer Transporter for Gmail
 */
function getTransporter() {
  const user = process.env.EMAIL_USER || 'grkroyalcomputers@gmail.com';
  const pass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.trim() : '';

  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: user,
      pass: pass,
    },
  });
}

/**
 * Send 6-Digit Password Reset OTP via Email
 * @param {string} toEmail - Recipient email address
 * @param {string} otp - 6-digit OTP code
 */
async function sendOtpEmail(toEmail, otp) {
  const user = process.env.EMAIL_USER || 'grkroyalcomputers@gmail.com';
  const pass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.trim() : '';

  // If EMAIL_PASS is empty or placeholder, inform clearly in console
  if (!pass || pass === 'your_gmail_app_password_here') {
    console.warn('\n⚠️ [Nodemailer] Warning: EMAIL_PASS is not set in backend/.env.');
    console.warn(`🔑 Generated OTP for ${toEmail}: [ ${otp} ]`);
    console.warn('👉 To send live emails, generate a 16-character App Password at https://myaccount.google.com/apppasswords and set EMAIL_PASS in backend/.env\n');
    return {
      success: false,
      devOtp: otp,
      reason: 'MISSING_APP_PASSWORD',
      message: 'Gmail App Password not configured in backend/.env',
    };
  }

  const transporter = getTransporter();

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset OTP - Royal Computers</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #0d131f;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          color: #e2e8f0;
        }
        .container {
          max-width: 540px;
          margin: 30px auto;
          background: #131b2e;
          border-radius: 16px;
          border: 1px solid #1e293b;
          overflow: hidden;
          box-shadow: 0 10px 35px rgba(0, 0, 0, 0.45);
        }
        .header {
          background: linear-gradient(135deg, #10172a 0%, #1a2238 100%);
          padding: 30px 24px 24px;
          text-align: center;
          border-bottom: 2px solid #cca248;
        }
        .brand-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #0b1120;
          background: #cca248;
          padding: 4px 12px;
          border-radius: 20px;
          margin-bottom: 12px;
        }
        .title {
          font-size: 24px;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 6px 0;
          letter-spacing: 0.5px;
        }
        .subtitle {
          font-size: 13px;
          color: #94a3b8;
          margin: 0;
        }
        .content {
          padding: 32px 28px;
        }
        .greeting {
          font-size: 16px;
          font-weight: 600;
          color: #f1f5f9;
          margin-bottom: 14px;
        }
        .text {
          font-size: 14px;
          line-height: 1.6;
          color: #94a3b8;
          margin: 0 0 20px 0;
        }
        .otp-card {
          background: #090e17;
          border: 2px dashed #cca248;
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          margin: 24px 0;
        }
        .otp-label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #cca248;
          font-weight: 700;
          margin-bottom: 10px;
        }
        .otp-code {
          font-size: 38px;
          font-weight: 900;
          letter-spacing: 10px;
          color: #f8fafc;
          font-family: 'Courier New', Courier, monospace;
          margin: 6px 0;
          text-shadow: 0 0 16px rgba(204, 162, 72, 0.4);
        }
        .otp-expiry {
          font-size: 12px;
          color: #ef4444;
          margin-top: 10px;
          font-weight: 500;
        }
        .instructions {
          background: rgba(30, 41, 59, 0.6);
          border-left: 3px solid #3b82f6;
          padding: 14px 16px;
          border-radius: 0 8px 8px 0;
          margin: 24px 0 10px 0;
        }
        .instructions p {
          margin: 0;
          font-size: 12.5px;
          line-height: 1.5;
          color: #cbd5e1;
        }
        .footer {
          background: #0b1120;
          padding: 20px 24px;
          text-align: center;
          border-top: 1px solid #1e293b;
          font-size: 12px;
          color: #64748b;
          line-height: 1.5;
        }
        .footer strong {
          color: #cca248;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <span class="brand-badge">ROYAL COMPUTERS</span>
          <h1 class="title">Password Reset OTP</h1>
          <p class="subtitle">Secure Shop Management Access Verification</p>
        </div>

        <div class="content">
          <div class="greeting">Hello Shop Owner / Administrator,</div>
          <p class="text">
            We received a request to reset your password for your <strong>Royal Computers Xerox Shop</strong> management portal.
            Use the one-time verification code below to authorize the password change:
          </p>

          <div class="otp-card">
            <div class="otp-label">Your One-Time Password (OTP)</div>
            <div class="otp-code">${otp}</div>
            <div class="otp-expiry">⏳ Valid for 10 minutes only</div>
          </div>

          <div class="instructions">
            <p><strong>Security Tip:</strong> Never share this OTP code with anyone. Royal Computers staff will never ask for your OTP. If you did not request this password reset, you can safely ignore this email.</p>
          </div>
        </div>

        <div class="footer">
          <strong>Royal Computers Xerox Shop</strong><br>
          142 College High Road, Opposite Arts College, Pin 600028<br>
          Phone: +91 75981 88737 | Email: ${user}
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"Royal Computers Xerox Shop" <${user}>`,
    to: toEmail,
    subject: `🔐 ${otp} is your Royal Computers Password Reset OTP`,
    text: `Your Royal Computers Password Reset OTP is: ${otp}. It is valid for 10 minutes. If you did not request this, please ignore this email.`,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [Nodemailer] OTP Email sent successfully to ${toEmail}. MessageId: ${info.messageId}`);
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error(`❌ [Nodemailer] Error sending email to ${toEmail}:`, error.message);
    return {
      success: false,
      devOtp: otp,
      error: error.message,
      message: 'Failed to deliver email via Gmail SMTP. Check EMAIL_USER and EMAIL_PASS.',
    };
  }
}

module.exports = {
  sendOtpEmail,
};
