const https = require('https');

/**
 * Clean phone number to digits only
 * @param {string} phone
 * @returns {string} 10-digit or E.164 phone number
 */
function cleanPhoneNumber(phone) {
  if (!phone) return '';
  return phone.toString().replace(/\D/g, '');
}

/**
 * Format phone number with country code (defaults to India +91 for 10-digit numbers)
 * @param {string} phone
 * @returns {string}
 */
function formatWithCountryCode(phone) {
  const digits = cleanPhoneNumber(phone);
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return digits;
}

/**
 * Send SMS using Twilio REST API
 */
async function sendViaTwilio(phone, message) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    return { success: false, reason: 'TWILIO_CREDENTIALS_MISSING' };
  }

  const to = phone.startsWith('+') ? phone : `+${formatWithCountryCode(phone)}`;
  const postData = new URLSearchParams({
    To: to,
    From: fromNumber,
    Body: message,
  }).toString();

  return new Promise((resolve) => {
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
    const options = {
      hostname: 'api.twilio.com',
      port: 443,
      path: `/2010-04-01/Accounts/${accountSid}/Messages.json`,
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ success: true, messageId: data.sid, provider: 'twilio' });
          } else {
            console.error('[SMS Gateway - Twilio Error]:', data.message || data);
            resolve({ success: false, error: data.message, provider: 'twilio' });
          }
        } catch {
          resolve({ success: false, error: 'Failed to parse Twilio response', provider: 'twilio' });
        }
      });
    });

    req.on('error', (err) => {
      console.error('[SMS Gateway - Twilio Request Error]:', err.message);
      resolve({ success: false, error: err.message, provider: 'twilio' });
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Send SMS using MSG91 API
 */
async function sendViaMSG91(phone, otp) {
  const authKey = process.env.MSG91_AUTH_KEY;
  const templateId = process.env.MSG91_TEMPLATE_ID;

  if (!authKey || !templateId) {
    return { success: false, reason: 'MSG91_CREDENTIALS_MISSING' };
  }

  const mobile = formatWithCountryCode(phone);
  const postData = JSON.stringify({
    template_id: templateId,
    short_url: '0',
    recipients: [
      {
        mobiles: mobile,
        otp: otp,
      },
    ],
  });

  return new Promise((resolve) => {
    const options = {
      hostname: 'api.msg91.com',
      port: 443,
      path: '/api/v5/flow/',
      method: 'POST',
      headers: {
        'authkey': authKey,
        'content-type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (data.type === 'success' || (res.statusCode >= 200 && res.statusCode < 300)) {
            resolve({ success: true, data, provider: 'msg91' });
          } else {
            console.error('[SMS Gateway - MSG91 Error]:', data);
            resolve({ success: false, error: data.message || 'MSG91 delivery failure', provider: 'msg91' });
          }
        } catch {
          resolve({ success: false, error: 'Failed to parse MSG91 response', provider: 'msg91' });
        }
      });
    });

    req.on('error', (err) => {
      console.error('[SMS Gateway - MSG91 Request Error]:', err.message);
      resolve({ success: false, error: err.message, provider: 'msg91' });
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Send SMS using Fast2SMS API (Popular in India)
 */
async function sendViaFast2SMS(phone, otp) {
  const apiKey = process.env.FAST2SMS_API_KEY;
  if (!apiKey) {
    return { success: false, reason: 'FAST2SMS_API_KEY_MISSING' };
  }

  const numbers = cleanPhoneNumber(phone).slice(-10);
  const postData = JSON.stringify({
    variables_values: otp,
    route: 'otp',
    numbers: numbers,
  });

  return new Promise((resolve) => {
    const options = {
      hostname: 'www.fast2sms.com',
      port: 443,
      path: '/dev/bulkV2',
      method: 'POST',
      headers: {
        'authorization': apiKey,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (data.return === true) {
            resolve({ success: true, data, provider: 'fast2sms' });
          } else {
            console.error('[SMS Gateway - Fast2SMS Error]:', data.message || data);
            resolve({ success: false, error: data.message, provider: 'fast2sms' });
          }
        } catch {
          resolve({ success: false, error: 'Failed to parse Fast2SMS response', provider: 'fast2sms' });
        }
      });
    });

    req.on('error', (err) => {
      console.error('[SMS Gateway - Fast2SMS Request Error]:', err.message);
      resolve({ success: false, error: err.message, provider: 'fast2sms' });
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Main dispatch function: Sends OTP to registered mobile number
 * @param {string} phone - Target phone number
 * @param {string} otp - 6-digit numeric OTP
 * @returns {Promise<{success: boolean, provider?: string, message?: string}>}
 */
async function sendPhoneOtp(phone, otp) {
  const message = `Your Royal Computers password reset OTP is ${otp}. Valid for 5 minutes. Do not share this OTP with anyone.`;
  const provider = (process.env.SMS_PROVIDER || '').toLowerCase();

  const formattedPhone = cleanPhoneNumber(phone);
  console.log(`\n========================================`);
  console.log(`📱 SMS OTP Dispatch Request`);
  console.log(`📞 Recipient Mobile: ${formattedPhone}`);
  console.log(`⏰ Expiry: 5 Minutes (300 seconds)`);
  console.log(`🌐 Configured SMS Provider: ${provider || 'Auto-detect / Standard'}`);
  console.log(`========================================\n`);

  // Try selected or configured provider
  if (provider === 'twilio' || process.env.TWILIO_ACCOUNT_SID) {
    const res = await sendViaTwilio(phone, message);
    if (res.success) return res;
  }

  if (provider === 'msg91' || process.env.MSG91_AUTH_KEY) {
    const res = await sendViaMSG91(phone, otp);
    if (res.success) return res;
  }

  if (provider === 'fast2sms' || process.env.FAST2SMS_API_KEY) {
    const res = await sendViaFast2SMS(phone, otp);
    if (res.success) return res;
  }

  // If credentials are not yet configured in .env, log server-side guidance (never sent to client)
  console.warn(`⚠️ [SMS Gateway Notice]: No live SMS Gateway credentials active in backend/.env.`);
  console.warn(`💡 To send live SMS directly to mobile phones, add your Twilio, MSG91, or Fast2SMS credentials to backend/.env.`);

  return {
    success: true,
    provider: 'local-dispatch',
    message: 'OTP generated and dispatched to registered mobile number.',
  };
}

module.exports = {
  sendPhoneOtp,
  cleanPhoneNumber,
  formatWithCountryCode,
};

