const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json()); 


const notificationApi = require('./notification-api');
app.use('/api/notifications', notificationApi);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});


const URL = process.env.MONGODB_URL;
mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.once('open', () => {
  console.log('MongoDB connected for chat!');
});


const messageSchema = new mongoose.Schema({
  text: String,
  userId: String,
  createdAt: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', messageSchema);

io.on('connection', async (socket) => {
  console.log('A user connected:', socket.id);


  const messages = await Message.find().sort({ createdAt: 1 }).limit(50);
  socket.emit('chat history', messages);


  socket.on('chat message', async (msgObj) => {
    const msg = new Message({ text: msgObj.text, userId: msgObj.userId });
    await msg.save();
    io.emit('chat message', msg); 
  });

  socket.on('clear chat', async () => {
    await Message.deleteMany({});
    io.emit('chat history', []);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Chat server listening on port ${PORT}`);
});
