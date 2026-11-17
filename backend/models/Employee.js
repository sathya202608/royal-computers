const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
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
    role: {
      type: String,
      default: "Machine Operator",
    },
    shift: {
      type: String,
      default: "Morning (8:00 AM - 4:00 PM)",
    },
    assignedMachine: {
      type: String,
      default: "Canon imageRUNNER",
    },
    todayImpressions: {
      type: Number,
      default: 0,
    },
    phone: {
      type: String,
      default: "+91 90000 00000",
    },
    status: {
      type: String,
      enum: ["On Duty", "Off Duty"],
      default: "On Duty",
    },
    joinDate: {
      type: String,
      default: "Today",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Employee', employeeSchema);
