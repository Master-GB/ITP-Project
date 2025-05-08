
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();


const notificationSchema = new mongoose.Schema({
  message: String,
  time: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});
const Notification = mongoose.model('donornotifications', notificationSchema);


router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ time: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


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


router.patch('/markAllRead', async (req, res) => {
  try {
    await Notification.updateMany({}, { $set: { read: true } }); 
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete('/', async (req, res) => {
  try {
    await Notification.deleteMany({});
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
