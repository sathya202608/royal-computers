const mongoose = require('mongoose');

const billItemSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  pages: { type: Number, default: 1 },
  copies: { type: Number, default: 1 },
});

const billSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    customer: {
      type: String,
      default: "Walk-in Customer",
    },
    phone: {
      type: String,
      default: "N/A",
    },
    itemsCount: {
      type: Number,
      default: 0,
    },
    items: [billItemSchema],
    subtotal: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    mode: {
      type: String,
      default: "UPI / GPay",
    },
    date: {
      type: String,
      default: "Just now",
    },
    dateTimeFull: {
      type: String,
      default: () => new Date().toLocaleString(),
    },
    itemsDetail: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Bill', billSchema);
