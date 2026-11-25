const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/task.model');

const router = express.Router();
const ALLOWED_STATUSES = ['pending', 'in-progress', 'done'];

router.post('/tasks', async (req, res) => {
  try {
    const { title, status, dueDate, userId } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ message: 'Valid title is required' });
    }
    if (status && !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    if (dueDate && Number.isNaN(Date.parse(dueDate))) {
      return res.status(400).json({ message: 'Invalid dueDate' });
    }
    if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId' });
    }

    const task = await Task.create({
      title: title.trim(),
      status,
      dueDate,
      userId,
    });

    return res.status(201).json(task);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/tasks', async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) {
      if (!ALLOWED_STATUSES.includes(req.query.status)) {
        return res.status(400).json({ message: 'Invalid status filter' });
      }
      filter.status = req.query.status;
    }

    const [total, data] = await Promise.all([
      Task.countDocuments(filter),
      Task.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    ]);

    return res.json({
      total,
      page,
      limit,
      data,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;