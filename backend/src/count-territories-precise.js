// Script to identify exact duplicate territories
const { territories } = require('./models/game-map');

console.log('All territory IDs:');
territories.forEach((territory, index) => {
  console.log(`${index + 1}: ${territory.id}`);
});

// Find duplicates
const territoryIds = territories.map(t => t.id);
const duplicates = territoryIds.filter((id, index) => territoryIds.indexOf(id) !== index);

console.log('\nDuplicate territory IDs:');
const uniqueDuplicates = [...new Set(duplicates)];
uniqueDuplicates.forEach(id => {
  console.log(`  ${id}`);
});

// Show all occurrences of duplicates
uniqueDuplicates.forEach(id => {
  console.log(`\nOccurrences of ${id}:`);
  territoryIds.forEach((territoryId, index) => {
    if (territoryId === id) {
      console.log(`  ${index + 1}: ${territories[index].continent}`);
    }
  });
});