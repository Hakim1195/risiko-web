// Socket.io Routes for Risk Game
import { Router, Request, Response } from 'express';
import { initializeSocket } from '../services/socket.service';
import { Server } from 'socket.io';

const router = Router();

// Initialize Socket.io
let io: Server | null = null;

router.post('/initialize', (req: Request, res: Response) => {
  if (!io) {
    // This should be called from server.js with the HTTP server
    res.status(500).json({ error: 'Socket.io not initialized. Please restart the server.' });
    return;
  }
  res.json({ success: true, socketId: 'socket-initialized' });
});

// Get Socket.io status
router.get('/status', (req: Request, res: Response) => {
  if (!io) {
    res.json({ connected: false, socketId: null });
    return;
  }
  res.json({ 
    connected: true, 
    socketId: 'socket-initialized',
    clients: 0
  });
});

export default { router, initialize: (server: any) => {
  io = initializeSocket(server);
  return io;
}};
