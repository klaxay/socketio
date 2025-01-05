const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
app.use(cors({
  origin: "http://localhost:3000", // Adjust based on your frontend URL (React on localhost:3000)
  methods: ["GET", "POST"],
  credentials: true,
}));

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Make sure this matches your React frontend's URL
    methods: ["GET", "POST"],
    credentials: true,
  }
});


// Serve static files for the client-side
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  // Handle public broadcasts
  socket.on('publicMessage', (message) => {
    console.log(`Public Message: ${message}`);
    io.emit('message', { type: 'public', message });
  });

  // Handle room joining
  socket.on('joinRoom', ({ roomId, username }) => {
    socket.join(roomId);
    console.log(`${username} joined room: ${roomId}`);

    // Notify other users in the room
    socket.to(roomId).emit('message', {
      type: 'roomJoin',
      message: `${username} has joined the room.`,
    });

    // Send acknowledgment to the user
    socket.emit('roomJoined', roomId);
  });

  // Handle private room messages
  socket.on('roomMessage', ({ roomId, username, message }) => {
    console.log(`Room ${roomId} - ${username}: ${message}`);
    io.to(roomId).emit('message', { type: 'room', username, message });
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(5000, () => {
  console.log('Server is running on port 5000');
});
