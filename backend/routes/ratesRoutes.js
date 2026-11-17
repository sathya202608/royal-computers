const express = require('express');
const router = express.Router();
const RateCategory = require('../models/RateCategory');
const { DEFAULT_RATES } = require('../data/defaultData');

// GET /api/rates - Get all rate categories directly from MongoDB Atlas
router.get('/', async (req, res) => {
  try {
    const categories = await RateCategory.find();
    res.json({ success: true, data: categories || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/rates/:categoryId/item - Add a new rate item to a category
router.post('/:categoryId/item', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, price, unit, popular } = req.body;

    const category = await RateCategory.findOne({ id: categoryId });
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    const newRate = {
      id: `r-${Date.now()}`,
      name,
      price: Number(price) || 0,
      unit: unit || "per page",
      popular: !!popular,
    };

    category.rates.push(newRate);
    await category.save();

    res.status(201).json({ success: true, data: category, newRate });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/rates/:categoryId/item/:rateId - Update a rate item
router.put('/:categoryId/item/:rateId', async (req, res) => {
  try {
    const { categoryId, rateId } = req.params;
    const { name, price, unit, popular } = req.body;

    const category = await RateCategory.findOne({ id: categoryId });
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    const rateIndex = category.rates.findIndex((r) => r.id === rateId);
    if (rateIndex === -1) {
      return res.status(404).json({ success: false, message: "Rate item not found" });
    }

    if (name !== undefined) category.rates[rateIndex].name = name;
    if (price !== undefined) category.rates[rateIndex].price = Number(price);
    if (unit !== undefined) category.rates[rateIndex].unit = unit;
    if (popular !== undefined) category.rates[rateIndex].popular = !!popular;

    await category.save();

    res.json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/rates/:categoryId/item/:rateId - Delete a rate item
router.delete('/:categoryId/item/:rateId', async (req, res) => {
  try {
    const { categoryId, rateId } = req.params;

    const category = await RateCategory.findOne({ id: categoryId });
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    category.rates = category.rates.filter((r) => r.id !== rateId);
    await category.save();

    res.json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/rates/bulk-sync - Bulk update all rates
router.put('/bulk-sync', async (req, res) => {
  try {
    const { categories } = req.body;
    if (!Array.isArray(categories)) {
      return res.status(400).json({ success: false, message: "Expected array of categories" });
    }

    await RateCategory.deleteMany({});
    const saved = await RateCategory.insertMany(categories);

    res.json({ success: true, message: "Rates synchronized", data: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
