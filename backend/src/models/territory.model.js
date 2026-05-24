// Territory model for Risk game
class Territory {
  constructor(id, name, continent, adjacentTerritories = [], armies = 0, owner = null) {
    this.id = id;
    this.name = name;
    this.continent = continent;
    this.adjacentTerritories = adjacentTerritories;
    this.armies = armies;
    this.owner = owner; // Player ID
  }

  // Add armies to territory
  addArmies(count) {
    this.armies += count;
  }

  // Remove armies from territory
  removeArmies(count) {
    this.armies = Math.max(0, this.armies - count);
  }

  // Set owner of territory
  setOwner(playerId) {
    this.owner = playerId;
  }

  // Check if territory is adjacent to another territory
  isAdjacentTo(territoryId) {
    return this.adjacentTerritories.includes(territoryId);
  }
}

module.exports = Territory;