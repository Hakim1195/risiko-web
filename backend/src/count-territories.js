// Script to count territories and verify the game map
const { territories } = require('./models/game-map');

console.log('Total territories:', territories.length);

// Count territories by continent
const continentCounts = {};
territories.forEach(territory => {
  const continent = territory.continent;
  if (!continentCounts[continent]) {
    continentCounts[continent] = 0;
  }
  continentCounts[continent]++;
});

console.log('Territories by continent:');
Object.entries(continentCounts).forEach(([continent, count]) => {
  console.log(`  ${continent}: ${count}`);
});

// Check for duplicates
const territoryIds = territories.map(t => t.id);
const uniqueTerritoryIds = [...new Set(territoryIds)];
console.log('Unique territories:', uniqueTerritoryIds.length);
console.log('Duplicate territories:', territoryIds.length - uniqueTerritoryIds.length);

if (territoryIds.length === uniqueTerritoryIds.length) {
  console.log('✓ No duplicate territories found');
} else {
  console.log('✗ Duplicate territories found');
}