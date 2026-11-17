const express = require('express');
const router = express.Router();
const ShopSettings = require('../models/ShopSettings');
const { DEFAULT_SHOP_SETTINGS } = require('../data/defaultData');

// GET /api/settings - Fetch shop settings
router.get('/', async (req, res) => {
  try {
    let settings = await ShopSettings.findOne();
    if (!settings) {
      settings = await ShopSettings.create(DEFAULT_SHOP_SETTINGS);
    }
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/settings - Update shop settings
router.put('/', async (req, res) => {
  try {
    let settings = await ShopSettings.findOne();
    if (!settings) {
      settings = new ShopSettings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();
    res.json({ success: true, message: "Settings updated successfully", data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
