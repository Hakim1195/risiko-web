// Controller de gestion des salles
// Simuler une base de données de salles (à remplacer par une vraie base de données)
const rooms = [
  {
    id: 1,
    name: 'Salle de Stratégie',
    gameId: 1,
    maxPlayers: 4,
    currentPlayers: 2,
    status: 'open', // open, playing, closed
    creatorId: 1,
    createdAt: new Date()
  },
  {
    id: 2,
    name: 'Salle de Plateau',
    gameId: 2,
    maxPlayers: 6,
    currentPlayers: 3,
    status: 'playing', // open, playing, closed
    creatorId: 2,
    createdAt: new Date()
  }
];

// Récupérer toutes les salles
exports.getAllRooms = (req, res) => {
  try {
    res.json({
      rooms,
      count: rooms.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des salles:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors de la récupération des salles' 
    });
  }
};

// Récupérer une salle par ID
exports.getRoomById = (req, res) => {
  try {
    const { id } = req.params;
    const room = rooms.find(r => r.id === parseInt(id));
    
    if (!room) {
      return res.status(404).json({ 
        message: 'Salle non trouvée' 
      });
    }
    
    res.json({ room });
  } catch (error) {
    console.error('Erreur lors de la récupération de la salle:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors de la récupération de la salle' 
    });
  }
};

// Créer une nouvelle salle
exports.createRoom = (req, res) => {
  try {
    const { name, gameId, maxPlayers, creatorId } = req.body;
    
    // Validation des données
    if (!name || !gameId || !maxPlayers || !creatorId) {
      return res.status(400).json({ 
        message: 'Tous les champs sont requis' 
      });
    }
    
    // Créer la nouvelle salle
    const newRoom = {
      id: rooms.length + 1,
      name,
      gameId,
      maxPlayers,
      currentPlayers: 1,
      status: 'open',
      creatorId,
      createdAt: new Date()
    };
    
    rooms.push(newRoom);
    
    res.status(201).json({
      message: 'Salle créée avec succès',
      room: newRoom
    });
  } catch (error) {
    console.error('Erreur lors de la création de la salle:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors de la création de la salle' 
    });
  }
};

// Mettre à jour une salle
exports.updateRoom = (req, res) => {
  try {
    const { id } = req.params;
    const roomIndex = rooms.findIndex(r => r.id === parseInt(id));
    
    if (roomIndex === -1) {
      return res.status(404).json({ 
        message: 'Salle non trouvée' 
      });
    }
    
    const { name, maxPlayers, status } = req.body;
    
    // Mise à jour de la salle
    rooms[roomIndex] = {
      ...rooms[roomIndex],
      name: name || rooms[roomIndex].name,
      maxPlayers: maxPlayers || rooms[roomIndex].maxPlayers,
      status: status || rooms[roomIndex].status,
      updatedAt: new Date()
    };
    
    res.json({
      message: 'Salle mise à jour avec succès',
      room: rooms[roomIndex]
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la salle:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors de la mise à jour de la salle' 
    });
  }
};

// Supprimer une salle
exports.deleteRoom = (req, res) => {
  try {
    const { id } = req.params;
    const roomIndex = rooms.findIndex(r => r.id === parseInt(id));
    
    if (roomIndex === -1) {
      return res.status(404).json({ 
        message: 'Salle non trouvée' 
      });
    }
    
    const deletedRoom = rooms.splice(roomIndex, 1)[0];
    
    res.json({
      message: 'Salle supprimée avec succès',
      room: deletedRoom
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la salle:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors de la suppression de la salle' 
    });
  }
};

// Rejoindre une salle
exports.joinRoom = (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ 
        message: 'L\'ID de l\'utilisateur est requis' 
      });
    }
    
    const roomIndex = rooms.findIndex(r => r.id === parseInt(id));
    
    if (roomIndex === -1) {
      return res.status(404).json({ 
        message: 'Salle non trouvée' 
      });
    }
    
    const room = rooms[roomIndex];
    
    // Vérifier si la salle est complète
    if (room.currentPlayers >= room.maxPlayers) {
      return res.status(400).json({ 
        message: 'La salle est complète' 
      });
    }
    
    // Vérifier si l'utilisateur a déjà rejoint la salle
    // (Pour simplifier, on suppose qu'il peut rejoindre plusieurs fois)
    
    // Mettre à jour le nombre de joueurs
    room.currentPlayers += 1;
    
    res.json({
      message: 'Vous avez rejoint la salle avec succès',
      room
    });
  } catch (error) {
    console.error('Erreur lors de la jonction à la salle:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors de la jonction à la salle' 
    });
  }
};

// Quitter une salle
exports.leaveRoom = (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ 
        message: 'L\'ID de l\'utilisateur est requis' 
      });
    }
    
    const roomIndex = rooms.findIndex(r => r.id === parseInt(id));
    
    if (roomIndex === -1) {
      return res.status(404).json({ 
        message: 'Salle non trouvée' 
      });
    }
    
    const room = rooms[roomIndex];
    
    // Vérifier si la salle est vide
    if (room.currentPlayers <= 0) {
      return res.status(400).json({ 
        message: 'La salle est déjà vide' 
      });
    }
    
    // Mettre à jour le nombre de joueurs
    room.currentPlayers -= 1;
    
    // Si la salle est vide, on peut la fermer ou la supprimer
    if (room.currentPlayers === 0) {
      room.status = 'closed';
    }
    
    res.json({
      message: 'Vous avez quitté la salle avec succès',
      room
    });
  } catch (error) {
    console.error('Erreur lors de la sortie de la salle:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors de la sortie de la salle' 
    });
  }
};