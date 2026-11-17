const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const Auth = require('../models/Auth');
const ShopSettings = require('../models/ShopSettings');
const { DEFAULT_AUTH } = require('../data/defaultData');
const { sendPhoneOtp, cleanPhoneNumber } = require('../utils/smsGateway');

// Helper to get auth record safely
async function getAuthRecord() {
  if (require('mongoose').connection.readyState === 1) {
    try {
      let auth = await Auth.findOne();
      if (!auth) {
        auth = await Auth.create(DEFAULT_AUTH);
      }
      return auth;
    } catch (err) {
      console.warn('⚠️ Mongoose DB read notice:', err.message);
    }
  }
  return { ...DEFAULT_AUTH };
}

// Helper to find Auth document by phone number (sanitizes non-digits, checks last 10 digits)
async function findAuthByPhone(phoneInput) {
  if (!phoneInput) return null;
  const targetDigits = phoneInput.toString().replace(/\D/g, '').slice(-10);
  if (!targetDigits) return null;

  if (require('mongoose').connection.readyState === 1) {
    try {
      const allAuths = await Auth.find();
      const match = allAuths.find((doc) => {
        const docPhoneDigits = (doc.phone || '').replace(/\D/g, '').slice(-10);
        return docPhoneDigits === targetDigits;
      });
      if (match) return match;

      // Check against ShopSettings phone (e.g. 75981 88737)
      const settings = await ShopSettings.findOne();
      const shopPhoneDigits = (settings?.phone || '75981 88737').replace(/\D/g, '').slice(-10);
      if (targetDigits === shopPhoneDigits && allAuths.length > 0) {
        return allAuths[0];
      }

      // In this shop system, if 1 primary account exists, match it
      if (allAuths.length === 1) {
        return allAuths[0];
      }
    } catch (err) {
      console.warn('⚠️ Error finding auth by phone in MongoDB:', err.message);
    }
  }
  return null;
}

// GET /api/auth/current - Get current owner info
router.get('/current', async (req, res) => {
  try {
    const auth = await getAuthRecord();
    res.json({
      success: true,
      data: {
        ownerId: auth.ownerId,
        ownerName: auth.ownerName,
        phone: auth.phone,
        email: auth.email,
        premierKey: auth.premierKey || "ROYAL777",
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/login - Validate login credentials (supports bcrypt and legacy upgrade)
router.post('/login', async (req, res) => {
  try {
    const { id, password } = req.body;
    if (!id || !password) {
      return res.status(400).json({ success: false, message: "User ID / Username and Password are required." });
    }

    const auth = await getAuthRecord();

    const trimmedId = id.trim().toLowerCase();
    const cleanInputPhone = id.replace(/\D/g, '').slice(-10);
    const cleanDbPhone = (auth.phone || '').replace(/\D/g, '').slice(-10);

    let isShopPhoneMatch = false;
    if (cleanInputPhone.length >= 10) {
      try {
        const settings = await ShopSettings.findOne();
        const shopPhone = (settings?.phone || '75981 88737').replace(/\D/g, '').slice(-10);
        if (cleanInputPhone === shopPhone) {
          isShopPhoneMatch = true;
        }
      } catch (e) {}
    }

    const matchId =
      trimmedId === (auth.ownerId || "").toLowerCase() ||
      trimmedId === (auth.email || "").toLowerCase() ||
      trimmedId === (auth.ownerName || "").toLowerCase() ||
      (cleanInputPhone.length >= 10 && cleanInputPhone === cleanDbPhone) ||
      isShopPhoneMatch;

    if (!matchId) {
      return res.status(401).json({
        success: false,
        message: "User ID / Mobile Number not found. Please verify your credentials.",
      });
    }

    // Verify Password: supports bcrypt hash with transparent legacy plain-text fallback
    let matchPwd = false;
    const isBcrypt = auth.password && (auth.password.startsWith('$2a$') || auth.password.startsWith('$2b$'));

    if (isBcrypt) {
      matchPwd = await bcrypt.compare(password, auth.password);
    } else {
      matchPwd = (password === auth.password);
      // Auto-upgrade plain-text password to bcrypt hash in MongoDB
      if (matchPwd && require('mongoose').connection.readyState === 1) {
        try {
          const salt = await bcrypt.genSalt(10);
          auth.password = await bcrypt.hash(password, salt);
          await auth.save();
        } catch (upgradeErr) {
          console.warn('⚠️ Notice during password hash upgrade:', upgradeErr.message);
        }
      }
    }

    if (!matchPwd) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password! Please enter the correct password.",
      });
    }

    return res.json({
      success: true,
      data: {
        ownerId: auth.ownerId,
        ownerName: auth.ownerName,
        phone: auth.phone,
        email: auth.email,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/register - Register new user/owner with bcrypt password hashing
router.post('/register', async (req, res) => {
  try {
    const { fullName, ownerId, username, phone, email, password } = req.body;
    const finalUserId = (username || ownerId || "").trim();
    if (!finalUserId || !password) {
      return res.status(400).json({ success: false, message: "User ID and password are required." });
    }

    if (password.length < 4) {
      return res.status(400).json({ success: false, message: "Password must be at least 4 characters long." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (require('mongoose').connection.readyState === 1) {
      let auth = await Auth.findOne();
      if (auth) {
        auth.ownerName = fullName || auth.ownerName;
        auth.ownerId = finalUserId;
        auth.phone = phone || auth.phone;
        if (email) auth.email = email;
        auth.password = hashedPassword;
        await auth.save();
      } else {
        await Auth.create({
          ownerName: fullName || "Royal User",
          ownerId: finalUserId,
          phone: phone || "75981 88737",
          email: email || "royalcomputers.xerox@gmail.com",
          password: hashedPassword,
          premierKey: "ROYAL777",
        });
      }
    }

    res.json({
      success: true,
      message: "Account created successfully with your password!",
      data: {
        ownerId: finalUserId,
        ownerName: fullName || "Royal User",
        phone: phone || "75981 88737",
        email: email || "royalcomputers.xerox@gmail.com",
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/send-phone-otp - Generate 6-digit OTP and send via SMS to registered mobile
router.post('/send-phone-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Please enter your registered mobile number.",
      });
    }

    const cleanDigits = phone.toString().replace(/\D/g, '').slice(-10);
    if (cleanDigits.length !== 10) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit registered mobile number.",
      });
    }

    // Verify the mobile number against MongoDB Atlas
    const auth = await findAuthByPhone(cleanDigits);
    if (!auth) {
      return res.status(404).json({
        success: false,
        message: "This mobile number is not registered in Royal Computers. Please enter your registered mobile number.",
      });
    }

    // Check resend cooldown (30 seconds)
    if (auth.resetOtpLastSent) {
      const elapsedMs = Date.now() - new Date(auth.resetOtpLastSent).getTime();
      const cooldownMs = 30 * 1000;
      if (elapsedMs < cooldownMs) {
        const remainingSec = Math.ceil((cooldownMs - elapsedMs) / 1000);
        return res.status(429).json({
          success: false,
          message: `Please wait ${remainingSec} seconds before requesting a new OTP.`,
        });
      }
    }

    // Generate secure 6-digit numeric OTP
    const otp = crypto.randomInt(100000, 1000000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes (300 seconds)

    // Save OTP and reset verification state in MongoDB Atlas
    auth.resetOtp = otp;
    auth.resetOtpExpiry = expiry;
    auth.resetOtpAttempts = 0;
    auth.resetOtpLastSent = new Date();
    auth.resetVerified = false;
    auth.resetVerifiedToken = null;
    await auth.save();

    // Send SMS OTP via Configurable SMS Gateway (Twilio / MSG91 / Fast2SMS)
    await sendPhoneOtp(cleanDigits, otp);

    // Return clean response - NEVER return actual OTP to frontend
    return res.json({
      success: true,
      message: "OTP sent to your registered mobile number.",
    });
  } catch (err) {
    console.error('Error in /send-phone-otp:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/verify-phone-otp - Verify user entered 6-digit OTP
router.post('/verify-phone-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Registered mobile number is required.",
      });
    }

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "Please enter the 6-digit OTP received on your mobile.",
      });
    }

    const cleanDigits = phone.toString().replace(/\D/g, '').slice(-10);
    const cleanOtp = otp.toString().trim();

    if (cleanOtp.length !== 6 || !/^\d{6}$/.test(cleanOtp)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 6-digit numeric OTP.",
      });
    }

    // Verify against MongoDB Atlas
    const auth = await findAuthByPhone(cleanDigits);
    if (!auth) {
      return res.status(404).json({
        success: false,
        message: "Registered account not found. Please check your mobile number.",
      });
    }

    // Check maximum verification attempts (max 5)
    if (auth.resetOtpAttempts >= 5) {
      auth.resetOtp = null;
      auth.resetOtpExpiry = null;
      await auth.save();
      return res.status(400).json({
        success: false,
        message: "Maximum OTP attempts exceeded. Please request a new OTP.",
      });
    }

    // Check OTP expiry (5 minutes)
    if (!auth.resetOtpExpiry || new Date(auth.resetOtpExpiry) < new Date()) {
      auth.resetOtp = null;
      auth.resetOtpExpiry = null;
      await auth.save();
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please click Resend OTP to get a new code.",
      });
    }

    // Compare OTP
    if (auth.resetOtp !== cleanOtp) {
      auth.resetOtpAttempts = (auth.resetOtpAttempts || 0) + 1;
      await auth.save();
      const remainingAttempts = 5 - auth.resetOtpAttempts;
      return res.status(400).json({
        success: false,
        message: remainingAttempts > 0
          ? `Invalid OTP! Please check the 6-digit code received on your phone. (${remainingAttempts} attempts remaining)`
          : "Invalid OTP! Maximum attempts exceeded. Please request a new OTP.",
      });
    }

    // OTP Verified successfully - generate secure verification reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    auth.resetOtp = null;
    auth.resetOtpExpiry = null;
    auth.resetOtpAttempts = 0;
    auth.resetVerified = true;
    auth.resetVerifiedToken = resetToken;
    await auth.save();

    return res.json({
      success: true,
      message: "OTP verified successfully! You can now set your new password.",
      resetToken,
    });
  } catch (err) {
    console.error('Error in /verify-phone-otp:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/reset-password - Set new password after OTP verification, stored with bcrypt
router.post('/reset-password', async (req, res) => {
  try {
    const { phone, newPassword, resetToken, userId, email, otp } = req.body;

    if (!newPassword || newPassword.length < 4) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 4 characters long.",
      });
    }

    let auth = null;
    if (phone) {
      const cleanDigits = phone.toString().replace(/\D/g, '').slice(-10);
      auth = await findAuthByPhone(cleanDigits);
    }

    if (!auth && (userId || email)) {
      auth = await getAuthRecord();
    }

    if (!auth) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    // Check authorization: must have valid resetToken from successful OTP verification
    const isTokenValid = resetToken && auth.resetVerified && auth.resetVerifiedToken === resetToken;
    const isDirectOtpValid = otp && auth.resetOtp && auth.resetOtp === otp.trim() && auth.resetOtpExpiry && new Date(auth.resetOtpExpiry) >= new Date();

    if (!isTokenValid && !isDirectOtpValid) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized request. Please verify OTP first before resetting password.",
      });
    }

    // Hash new password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    auth.password = hashedPassword;
    auth.resetOtp = null;
    auth.resetOtpExpiry = null;
    auth.resetOtpAttempts = 0;
    auth.resetVerified = false;
    auth.resetVerifiedToken = null;
    await auth.save();

    return res.json({
      success: true,
      message: "Password changed successfully! You can now sign in with your new password.",
    });
  } catch (err) {
    console.error('Error in /reset-password:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Legacy backward compatibility endpoint wrappers
router.post('/send-otp', async (req, res) => {
  const { phone, email } = req.body;
  if (phone) {
    req.url = '/send-phone-otp';
    return router.handle(req, res);
  }
  const auth = await getAuthRecord();
  req.body.phone = auth.phone || "75981 88737";
  return router.handle(req, res);
});

router.post('/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;
  if (!phone) {
    const auth = await getAuthRecord();
    req.body.phone = auth.phone || "75981 88737";
  }
  return router.handle(req, res);
});

// PUT /api/auth/profile - Update owner and shop profile
router.put('/profile', async (req, res) => {
  try {
    const {
      ownerName,
      phone,
      email,
      premierKey,
      newPassword,
      shopName,
      gstNumber,
      address,
      upiId,
    } = req.body;

    let auth = await Auth.findOne();
    if (!auth) auth = await Auth.create(DEFAULT_AUTH);

    if (ownerName !== undefined) auth.ownerName = ownerName;
    if (phone !== undefined) auth.phone = phone;
    if (email !== undefined) auth.email = email;
    if (premierKey !== undefined) auth.premierKey = premierKey;

    if (newPassword && newPassword.length >= 4) {
      const salt = await bcrypt.genSalt(10);
      auth.password = await bcrypt.hash(newPassword, salt);
    }
    await auth.save();

    let settings = await ShopSettings.findOne();
    if (!settings) settings = new ShopSettings();

    if (shopName !== undefined) settings.shopName = shopName;
    if (phone !== undefined) settings.phone = phone;
    if (email !== undefined) settings.email = email;
    if (gstNumber !== undefined) settings.gstNumber = gstNumber;
    if (address !== undefined) settings.address = address;
    if (upiId !== undefined) settings.upiId = upiId;
    await settings.save();

    res.json({
      success: true,
      message: "Profile and shop settings updated successfully in MongoDB!",
      auth: {
        ownerId: auth.ownerId,
        ownerName: auth.ownerName,
        phone: auth.phone,
        email: auth.email,
        premierKey: auth.premierKey,
      },
      shopSettings: settings,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
