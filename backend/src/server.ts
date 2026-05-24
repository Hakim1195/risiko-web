import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(express.json());
app.use(cors());

// Routes
import authRoutes from './routes/auth.routes';
import roomRoutes from './routes/rooms.routes';

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'Game Board Strategy API is running' });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle authentication
  socket.on('authenticate', (token: string) => {
    // In a real implementation, verify JWT token here
    console.log('User authenticated with token:', token);
  });

  // Handle room joining
  socket.on('join-room', (roomId: number, playerId: number) => {
    socket.join(roomId.toString());
    console.log(`User ${playerId} joined room ${roomId}`);
    // Broadcast to room that player joined
    io.to(roomId.toString()).emit('room:joined', { roomId, playerId });
  });

  // Handle room leaving
  socket.on('leave-room', (roomId: number) => {
    socket.leave(roomId.toString());
    console.log(`User left room ${roomId}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { app, server, io };