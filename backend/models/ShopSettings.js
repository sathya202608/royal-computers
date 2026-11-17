const mongoose = require('mongoose');

const serviceItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  icon: { type: String, default: "🖨️" },
});

const shopSettingsSchema = new mongoose.Schema(
  {
    shopName: {
      type: String,
      default: "Royal Computers Xerox Shop",
    },
    established: {
      type: String,
      default: "2012",
    },
    tagline: {
      type: String,
      default: "Complete Shop Management System",
    },
    subTagline: {
      type: String,
      default: "Billing · Stock · Employees · Reports",
    },
    address: {
      type: String,
      default: "142 College High Road, Opposite Arts College, Pin 600028",
    },
    gstNumber: {
      type: String,
      default: "33AAAAA0000A1Z5",
    },
    upiId: {
      type: String,
      default: "royalcomputers@okaxis",
    },
    phone: {
      type: String,
      default: "75981 88737",
    },
    email: {
      type: String,
      default: "royalcomputers.xerox@gmail.com",
    },
    services: [serviceItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('ShopSettings', shopSettingsSchema);
