// Notification REST API for MongoDB persistence, non-intrusive to chat-server.js
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Notification schema/model
const notificationSchema = new mongoose.Schema({
  message: String,
  time: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});
const Notification = mongoose.model('donornotifications', notificationSchema);

// GET /api/notifications - Get all notifications
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ time: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/notifications - Add a notification
router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    const notif = new Notification({ message });
    await notif.save();
    res.status(201).json(notif);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/notifications/markAllRead - Mark all notifications as read
router.patch('/markAllRead', async (req, res) => {
  try {
    await Notification.updateMany({}, { $set: { read: true } }); // Mark all as read, regardless of previous value
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/notifications - Clear all notifications
router.delete('/', async (req, res) => {
  try {
    await Notification.deleteMany({});
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
