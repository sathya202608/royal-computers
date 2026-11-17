const express = require('express');
const router = express.Router();
const Auth = require('../models/Auth');
const ShopSettings = require('../models/ShopSettings');
const RateCategory = require('../models/RateCategory');
const Stock = require('../models/Stock');
const Employee = require('../models/Employee');
const Bill = require('../models/Bill');

const {
  DEFAULT_AUTH,
  DEFAULT_SHOP_SETTINGS,
  DEFAULT_RATES,
  DEFAULT_STOCK,
  DEFAULT_EMPLOYEES,
  DEFAULT_BILLS,
} = require('../data/defaultData');

// POST /api/seed - Seed default data if collections are empty or force
router.post('/seed', async (req, res) => {
  try {
    const { force } = req.body || {};

    if (force) {
      await Auth.deleteMany({});
      await ShopSettings.deleteMany({});
      await RateCategory.deleteMany({});
      await Stock.deleteMany({});
      await Employee.deleteMany({});
      await Bill.deleteMany({});
    }

    const authCount = await Auth.countDocuments();
    if (authCount === 0) await Auth.create(DEFAULT_AUTH);

    const settingsCount = await ShopSettings.countDocuments();
    if (settingsCount === 0) await ShopSettings.create(DEFAULT_SHOP_SETTINGS);

    const ratesCount = await RateCategory.countDocuments();
    if (ratesCount === 0) await RateCategory.insertMany(DEFAULT_RATES);

    const stockCount = await Stock.countDocuments();
    if (stockCount === 0) await Stock.insertMany(DEFAULT_STOCK);

    const empCount = await Employee.countDocuments();
    if (empCount === 0) await Employee.insertMany(DEFAULT_EMPLOYEES);

    const billCount = await Bill.countDocuments();
    if (billCount === 0) await Bill.insertMany(DEFAULT_BILLS);

    res.json({
      success: true,
      message: "Database successfully seeded with Royal Computers Xerox Shop defaults!",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
