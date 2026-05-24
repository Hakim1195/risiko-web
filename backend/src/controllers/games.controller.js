// Controller de gestion des jeux
// Simuler une base de données de jeux (à remplacer par une vraie base de données)
const games = [
  {
    id: 1,
    name: 'Jeu de Strategie',
    description: 'Un jeu de stratégie en temps réel',
    maxPlayers: 4,
    minPlayers: 2,
    category: 'Stratégie',
    createdAt: new Date()
  },
  {
    id: 2,
    name: 'Jeux de Plateau Classique',
    description: 'Le classique jeu de plateau',
    maxPlayers: 6,
    minPlayers: 2,
    category: 'Plateau',
    createdAt: new Date()
  }
];

// Récupérer tous les jeux
exports.getAllGames = (req, res) => {
  try {
    res.json({
      games,
      count: games.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des jeux:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors de la récupération des jeux' 
    });
  }
};

// Récupérer un jeu par ID
exports.getGameById = (req, res) => {
  try {
    const { id } = req.params;
    const game = games.find(g => g.id === parseInt(id));
    
    if (!game) {
      return res.status(404).json({ 
        message: 'Jeu non trouvé' 
      });
    }
    
    res.json({ game });
  } catch (error) {
    console.error('Erreur lors de la récupération du jeu:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors de la récupération du jeu' 
    });
  }
};

// Créer un nouveau jeu
exports.createGame = (req, res) => {
  try {
    const { name, description, maxPlayers, minPlayers, category } = req.body;
    
    // Validation des données
    if (!name || !description || !maxPlayers || !minPlayers || !category) {
      return res.status(400).json({ 
        message: 'Tous les champs sont requis' 
      });
    }
    
    // Créer le nouveau jeu
    const newGame = {
      id: games.length + 1,
      name,
      description,
      maxPlayers,
      minPlayers,
      category,
      createdAt: new Date()
    };
    
    games.push(newGame);
    
    res.status(201).json({
      message: 'Jeu créé avec succès',
      game: newGame
    });
  } catch (error) {
    console.error('Erreur lors de la création du jeu:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors de la création du jeu' 
    });
  }
};

// Mettre à jour un jeu
exports.updateGame = (req, res) => {
  try {
    const { id } = req.params;
    const gameIndex = games.findIndex(g => g.id === parseInt(id));
    
    if (gameIndex === -1) {
      return res.status(404).json({ 
        message: 'Jeu non trouvé' 
      });
    }
    
    const { name, description, maxPlayers, minPlayers, category } = req.body;
    
    // Mise à jour du jeu
    games[gameIndex] = {
      ...games[gameIndex],
      name: name || games[gameIndex].name,
      description: description || games[gameIndex].description,
      maxPlayers: maxPlayers || games[gameIndex].maxPlayers,
      minPlayers: minPlayers || games[gameIndex].minPlayers,
      category: category || games[gameIndex].category,
      updatedAt: new Date()
    };
    
    res.json({
      message: 'Jeu mis à jour avec succès',
      game: games[gameIndex]
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du jeu:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors de la mise à jour du jeu' 
    });
  }
};

// Supprimer un jeu
exports.deleteGame = (req, res) => {
  try {
    const { id } = req.params;
    const gameIndex = games.findIndex(g => g.id === parseInt(id));
    
    if (gameIndex === -1) {
      return res.status(404).json({ 
        message: 'Jeu non trouvé' 
      });
    }
    
    const deletedGame = games.splice(gameIndex, 1)[0];
    
    res.json({
      message: 'Jeu supprimé avec succès',
      game: deletedGame
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du jeu:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors de la suppression du jeu' 
    });
  }
};