const express = require('express');
const router = express.Router();
const Stock = require('../models/Stock');
const { DEFAULT_STOCK } = require('../data/defaultData');

// GET /api/stock - Get all stock items directly from MongoDB Atlas
router.get('/', async (req, res) => {
  try {
    const stock = await Stock.find().sort({ createdAt: -1 });
    res.json({ success: true, data: stock || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/stock - Add a new stock item
router.post('/', async (req, res) => {
  try {
    const { name, category, quantity, unit, minThreshold, supplier, id: customId } = req.body;
    let id = customId;
    if (!id || (await Stock.exists({ id }))) {
      const count = await Stock.countDocuments();
      let candidate = count + 1;
      while (await Stock.exists({ id: `STK-${String(candidate).padStart(2, "0")}` })) {
        candidate++;
      }
      id = `STK-${String(candidate).padStart(2, "0")}`;
    }

    const qty = Number(quantity) || 0;
    const threshold = Number(minThreshold) || 5;

    const newItem = await Stock.create({
      id,
      name,
      category: category || "Paper",
      quantity: qty,
      unit: unit || "Reams",
      minThreshold: threshold,
      supplier: supplier || "Distributor",
      lastRestocked: "Just now",
      status: qty <= threshold ? "Low" : "Normal",
    });

    res.status(201).json({ success: true, data: newItem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/stock/:id - Update stock item
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Stock.findOne({ id });
    if (!item) {
      return res.status(404).json({ success: false, message: "Stock item not found" });
    }

    const updatedFields = req.body;
    if (updatedFields.name !== undefined) item.name = updatedFields.name;
    if (updatedFields.category !== undefined) item.category = updatedFields.category;
    if (updatedFields.quantity !== undefined) item.quantity = Number(updatedFields.quantity);
    if (updatedFields.unit !== undefined) item.unit = updatedFields.unit;
    if (updatedFields.minThreshold !== undefined) item.minThreshold = Number(updatedFields.minThreshold);
    if (updatedFields.supplier !== undefined) item.supplier = updatedFields.supplier;
    if (updatedFields.lastRestocked !== undefined) item.lastRestocked = updatedFields.lastRestocked;

    item.status = item.quantity <= item.minThreshold ? "Low" : "Normal";
    await item.save();

    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/stock/:id/adjust - Quick increment/decrement quantity
router.patch('/:id/adjust', async (req, res) => {
  try {
    const { id } = req.params;
    const { delta } = req.body;

    const item = await Stock.findOne({ id });
    if (!item) {
      return res.status(404).json({ success: false, message: "Stock item not found" });
    }

    item.quantity = Math.max(0, item.quantity + (Number(delta) || 0));
    item.status = item.quantity <= item.minThreshold ? "Low" : "Normal";
    await item.save();

    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/stock/:id - Delete stock item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Stock.findOneAndDelete({ id });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Stock item not found" });
    }
    res.json({ success: true, message: "Stock item removed successfully", id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
