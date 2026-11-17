const mongoose = require('mongoose');

const rateItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  unit: { type: String, default: "per page" },
  popular: { type: Boolean, default: false },
});

const rateCategorySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    rates: [rateItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('RateCategory', rateCategorySchema);
