const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const { DEFAULT_EMPLOYEES } = require('../data/defaultData');

// GET /api/employees - Get all employees directly from MongoDB Atlas
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: 1 });
    res.json({ success: true, data: employees || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/employees - Add employee
router.post('/', async (req, res) => {
  try {
    const { name, role, shift, assignedMachine, todayImpressions, phone, id: customId } = req.body;
    let id = customId;
    if (!id || (await Employee.exists({ id }))) {
      const count = await Employee.countDocuments();
      let candidate = count + 1;
      while (await Employee.exists({ id: `EMP-${String(candidate).padStart(2, "0")}` })) {
        candidate++;
      }
      id = `EMP-${String(candidate).padStart(2, "0")}`;
    }

    const newEmp = await Employee.create({
      id,
      name,
      role: role || "Machine Operator",
      shift: shift || "Morning (8:00 AM - 4:00 PM)",
      assignedMachine: assignedMachine || "Canon imageRUNNER",
      todayImpressions: Number(todayImpressions) || 0,
      phone: phone || "+91 90000 00000",
      status: "On Duty",
      joinDate: "Today",
    });

    res.status(201).json({ success: true, data: newEmp });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/employees/:id - Update employee
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const emp = await Employee.findOne({ id });
    if (!emp) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    Object.assign(emp, req.body);
    await emp.save();

    res.json({ success: true, data: emp });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/employees/:id/toggle-duty - Toggle duty status
router.patch('/:id/toggle-duty', async (req, res) => {
  try {
    const { id } = req.params;
    const emp = await Employee.findOne({ id });
    if (!emp) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    emp.status = emp.status === "On Duty" ? "Off Duty" : "On Duty";
    await emp.save();

    res.json({ success: true, data: emp });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/employees/:id - Delete employee
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Employee.findOneAndDelete({ id });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }
    res.json({ success: true, message: "Employee deleted", id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
