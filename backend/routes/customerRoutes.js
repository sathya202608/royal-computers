const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// GET /api/customers - Fetch all customers directly from MongoDB Atlas
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json({ success: true, data: customers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/customers/:id - Fetch single customer by id or _id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let customer = await Customer.findOne({ id });
    if (!customer && id.match(/^[0-9a-fA-F]{24}$/)) {
      customer = await Customer.findById(id);
    }
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found in MongoDB' });
    }
    res.json({ success: true, data: customer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/customers - Insert new customer into MongoDB Atlas
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, address, category, notes, totalVisits, totalSpent, id: customId } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Customer name is required.' });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ success: false, message: 'Customer phone number is required.' });
    }

    // Generate unique ID if not provided or collision
    let customerId = customId ? customId.trim() : null;
    if (!customerId || (await Customer.exists({ id: customerId }))) {
      const count = await Customer.countDocuments();
      let candidate = count + 1;
      while (await Customer.exists({ id: `CUST-${String(candidate).padStart(4, '0')}` })) {
        candidate++;
      }
      customerId = `CUST-${String(candidate).padStart(4, '0')}`;
    }

    const newCustomer = await Customer.create({
      id: customerId,
      name: name.trim(),
      phone: phone.trim(),
      email: (email || '').trim().toLowerCase(),
      address: (address || '').trim(),
      category: category || 'Regular',
      notes: (notes || '').trim(),
      totalVisits: Number(totalVisits) || 1,
      totalSpent: Number(totalSpent) || 0,
    });

    res.status(201).json({
      success: true,
      message: 'Customer successfully added to MongoDB Atlas!',
      data: newCustomer,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/customers/:id - Update existing customer in MongoDB Atlas
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let customer = await Customer.findOne({ id });
    if (!customer && id.match(/^[0-9a-fA-F]{24}$/)) {
      customer = await Customer.findById(id);
    }

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found in MongoDB' });
    }

    const { name, phone, email, address, category, notes, totalVisits, totalSpent } = req.body;

    if (name !== undefined) customer.name = name.trim();
    if (phone !== undefined) customer.phone = phone.trim();
    if (email !== undefined) customer.email = email.trim().toLowerCase();
    if (address !== undefined) customer.address = address.trim();
    if (category !== undefined) customer.category = category;
    if (notes !== undefined) customer.notes = notes.trim();
    if (totalVisits !== undefined) customer.totalVisits = Number(totalVisits);
    if (totalSpent !== undefined) customer.totalSpent = Number(totalSpent);

    const updated = await customer.save();

    res.json({
      success: true,
      message: 'Customer successfully updated in MongoDB Atlas!',
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/customers/:id - Delete customer from MongoDB Atlas
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let deleted = await Customer.findOneAndDelete({ id });
    if (!deleted && id.match(/^[0-9a-fA-F]{24}$/)) {
      deleted = await Customer.findByIdAndDelete(id);
    }

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Customer not found in MongoDB' });
    }

    res.json({
      success: true,
      message: 'Customer successfully removed from MongoDB Atlas!',
      id: deleted.id,
      deletedCustomer: deleted,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

