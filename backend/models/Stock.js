const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "Paper",
    },
    quantity: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      default: "Reams",
    },
    minThreshold: {
      type: Number,
      default: 5,
    },
    supplier: {
      type: String,
      default: "Distributor",
    },
    lastRestocked: {
      type: String,
      default: "Just now",
    },
    status: {
      type: String,
      enum: ["Normal", "Low", "Critical"],
      default: "Normal",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Stock', stockSchema);
