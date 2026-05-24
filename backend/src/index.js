// Point d'entrée principal du backend
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

// Importer la configuration
const config = require('../config');

// Initialiser Express
const app = express();
const server = http.createServer(app);

// Configurer CORS
app.use(cors());

// Middleware pour parser le JSON
app.use(express.json());

// Initialiser Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Routes
const authRoutes = require('./routes/auth.routes');
const gamesRoutes = require('./routes/games.routes');
const roomsRoutes = require('./routes/rooms.routes');

// Middleware de routes
app.use('/api/auth', authRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/rooms', roomsRoutes);

// Routes de base
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bienvenue sur l\'API Game Board Strategy',
    version: config.app.version
  });
});

// Gestion des connexions Socket.IO
io.on('connection', (socket) => {
  console.log('Un utilisateur s\'est connecté:', socket.id);

  // Gérer la déconnexion
  socket.on('disconnect', () => {
    console.log('Un utilisateur s\'est déconnecté:', socket.id);
  });

  // Gérer l'entrée dans une salle de jeu
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`L'utilisateur ${socket.id} a rejoint la salle ${roomId}`);
  });

  // Gérer la sortie d'une salle de jeu
  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
    console.log(`L'utilisateur ${socket.id} a quitté la salle ${roomId}`);
  });
});

// Démarrer le serveur
const PORT = config.server.port;
server.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`Environnement: ${config.server.nodeEnv}`);
});

module.exports = { app, server, io };