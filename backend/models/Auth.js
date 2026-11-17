const mongoose = require('mongoose');

const authSchema = new mongoose.Schema(
  {
    ownerId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    premierKey: {
      type: String,
      default: "ROYAL777",
      trim: true,
    },
    ownerName: {
      type: String,
      default: "K. Rajasekaran",
      trim: true,
    },
    phone: {
      type: String,
      default: "75981 88737",
      trim: true,
    },
    email: {
      type: String,
      default: "grkroyalcomputers@gmail.com",
      trim: true,
      lowercase: true,
    },
    resetOtp: {
      type: String,
      default: null,
      trim: true,
    },
    resetOtpExpiry: {
      type: Date,
      default: null,
    },
    resetOtpAttempts: {
      type: Number,
      default: 0,
    },
    resetOtpLastSent: {
      type: Date,
      default: null,
    },
    resetVerified: {
      type: Boolean,
      default: false,
    },
    resetVerifiedToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Auth', authSchema);
