const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  user: { type: String, required: true }, // or ObjectId if you use user IDs
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);
