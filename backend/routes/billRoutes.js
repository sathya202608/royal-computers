const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');
const { DEFAULT_BILLS } = require('../data/defaultData');

// GET /api/bills - Get all bills (latest first) directly from MongoDB Atlas
router.get('/', async (req, res) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 });
    res.json({ success: true, data: bills || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/bills - Create a new bill / invoice
router.post('/', async (req, res) => {
  try {
    const {
      id,
      customer,
      phone,
      items,
      subtotal,
      discount,
      total,
      mode,
      date,
      dateTimeFull,
      itemsDetail,
    } = req.body;

    // Guaranteed unique bill ID generator
    let billId = id;
    if (!billId || (await Bill.exists({ id: billId }))) {
      const count = await Bill.countDocuments();
      let candidateNum = count + 143;
      while (await Bill.exists({ id: `RC-2026-${String(candidateNum).padStart(4, "0")}` })) {
        candidateNum++;
      }
      billId = `RC-2026-${String(candidateNum).padStart(4, "0")}`;
    }

    const itemsSummary =
      itemsDetail ||
      (items && items.length > 0
        ? items.map((i) => i.name).slice(0, 2).join(" & ") + (items.length > 2 ? ` + ${items.length - 2} more` : "")
        : "Print / Xerox Service");

    const newBill = await Bill.create({
      id: billId,
      customer: customer || "Walk-in Customer",
      phone: phone || "N/A",
      itemsCount: items ? items.length : 1,
      items: items || [],
      subtotal: Number(subtotal) || Number(total) || 0,
      discount: Number(discount) || 0,
      total: Number(total) || 0,
      mode: mode || "UPI / GPay",
      date: date || "Just now",
      dateTimeFull: dateTimeFull || new Date().toLocaleString(),
      itemsDetail: itemsSummary,
    });

    res.status(201).json({ success: true, data: newBill });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/bills/:id - Update an existing bill
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const bill = await Bill.findOne({ id });
    if (!bill) {
      return res.status(404).json({ success: false, message: "Bill not found" });
    }

    Object.assign(bill, req.body);
    await bill.save();

    res.json({ success: true, data: bill });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/bills/:id - Delete a bill
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Bill.findOneAndDelete({ id });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Bill not found" });
    }
    res.json({ success: true, message: "Bill deleted", id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
