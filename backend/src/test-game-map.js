// Test script to verify game map structure
const { continents, territories, territoryMap } = require('./models/game-map');

console.log('=== Risk Game Map Test ===\n');

// Test continents
console.log('Continents:');
Object.values(continents).forEach(continent => {
  console.log(`- ${continent.name}: ${continent.territoryCount} territories, ${continent.bonusArmies} bonus armies`);
});

console.log('\nTotal territories:', territories.length);

// Test territory map
console.log('\nSample territories from map:');
const sampleTerritories = Array.from(territoryMap.values()).slice(0, 5);
sampleTerritories.forEach(territory => {
  console.log(`- ${territory.name} (${territory.id}) in ${territory.continent}`);
});

// Test adjacency
console.log('\nTesting adjacency for Afghanistan:');
const afghanistan = territoryMap.get('AFGHANISTAN');
if (afghanistan) {
  console.log(`- Adjacent to: ${afghanistan.adjacentTerritories.join(', ')}`);
  console.log(`- Is adjacent to India: ${afghanistan.adjacentTerritories.includes('INDIA')}`);
}

console.log('\n=== Test Complete ===');