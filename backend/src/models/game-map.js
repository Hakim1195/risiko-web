// Game map configuration for Risk game with 42 territories and 6 continents
const Territory = require('./territory.model');

const continents = {
  ASIA: {
    id: 'ASIA',
    name: 'Asie',
    territoryCount: 11,
    bonusArmies: 7
  },
  NORTH_AMERICA: {
    id: 'NORTH_AMERICA',
    name: 'Amérique du Nord',
    territoryCount: 9,
    bonusArmies: 5
  },
  EUROPE: {
    id: 'EUROPE',
    name: 'Europe',
    territoryCount: 6,
    bonusArmies: 5
  },
  AFRICA: {
    id: 'AFRICA',
    name: 'Afrique',
    territoryCount: 6,
    bonusArmies: 3
  },
  SOUTH_AMERICA: {
    id: 'SOUTH_AMERICA',
    name: 'Amérique du Sud',
    territoryCount: 4,
    bonusArmies: 2
  },
  OCEANIA: {
    id: 'OCEANIA',
    name: 'Océanie',
    territoryCount: 4,
    bonusArmies: 2
  }
};

const territories = [
  // ASIA - 11 territories
  { id: 'AFGHANISTAN', name: 'Afghanistan', continent: 'ASIA', adjacent: ['CHINA', 'INDIA', 'MIDDLE_EAST', 'URAL', 'KAMCHATKA'] },
  { id: 'CHINA', name: 'Chine', continent: 'ASIA', adjacent: ['AFGHANISTAN', 'INDIA', 'MONGOLIA', 'SIBERIA', 'MIDDLE_EAST'] },
  { id: 'INDIA', name: 'Inde', continent: 'ASIA', adjacent: ['AFGHANISTAN', 'CHINA', 'MIDDLE_EAST', 'SIAM'] },
  { id: 'MIDDLE_EAST', name: 'Moyen-Orient', continent: 'ASIA', adjacent: ['AFGHANISTAN', 'CHINA', 'INDIA', 'EGYPT', 'URAL', 'KAMCHATKA'] },
  { id: 'MONGOLIA', name: 'Mongolie', continent: 'ASIA', adjacent: ['CHINA', 'SIBERIA', 'KAMCHATKA'] },
  { id: 'SIBERIA', name: 'Sibérie', continent: 'ASIA', adjacent: ['CHINA', 'MONGOLIA', 'URAL', 'KAMCHATKA'] },
  { id: 'URAL', name: 'Ural', continent: 'ASIA', adjacent: ['AFGHANISTAN', 'MIDDLE_EAST', 'SIBERIA'] },
  { id: 'KAMCHATKA', name: 'Kamchatka', continent: 'ASIA', adjacent: ['AFGHANISTAN', 'MONGOLIA', 'SIBERIA', 'MIDDLE_EAST'] },
  { id: 'SIAM', name: 'Siam', continent: 'ASIA', adjacent: ['INDIA', 'THAILAND'] },
  { id: 'THAILAND', name: 'Thaïlande', continent: 'ASIA', adjacent: ['SIAM'] },
  { id: 'INDONESIA', name: 'Indonésie', continent: 'ASIA', adjacent: ['SIAM', 'THAILAND', 'NEW_GUINEA'] },
  // Removed NEW_GUINEA from ASIA to avoid duplicates
  
  // NORTH_AMERICA - 9 territories
  { id: 'ALASKA', name: 'Alaska', continent: 'NORTH_AMERICA', adjacent: ['KAMCHATKA', 'NORTHWEST_TERRITORY', 'GREENLAND'] },
  { id: 'NORTHWEST_TERRITORY', name: 'Territoire du Nord-Ouest', continent: 'NORTH_AMERICA', adjacent: ['ALASKA', 'GREENLAND', 'ONTARIO', 'QUEBEC'] },
  { id: 'GREENLAND', name: 'Groenland', continent: 'NORTH_AMERICA', adjacent: ['ALASKA', 'NORTHWEST_TERRITORY', 'ONTARIO', 'QUEBEC'] },
  { id: 'ONTARIO', name: 'Ontario', continent: 'NORTH_AMERICA', adjacent: ['NORTHWEST_TERRITORY', 'GREENLAND', 'QUEBEC', 'ALBERTA', 'WESTERN_UNITED_STATES', 'EASTERN_UNITED_STATES'] },
  { id: 'QUEBEC', name: 'Québec', continent: 'NORTH_AMERICA', adjacent: ['NORTHWEST_TERRITORY', 'GREENLAND', 'ONTARIO', 'EASTERN_UNITED_STATES'] },
  { id: 'ALBERTA', name: 'Alberta', continent: 'NORTH_AMERICA', adjacent: ['ONTARIO', 'WESTERN_UNITED_STATES', 'ALASKA'] },
  { id: 'WESTERN_UNITED_STATES', name: 'États-Unis Occidentaux', continent: 'NORTH_AMERICA', adjacent: ['ALBERTA', 'ONTARIO', 'EASTERN_UNITED_STATES', 'MEXICO'] },
  { id: 'EASTERN_UNITED_STATES', name: 'États-Unis Orientaux', continent: 'NORTH_AMERICA', adjacent: ['ONTARIO', 'QUEBEC', 'WESTERN_UNITED_STATES', 'MEXICO'] },
  { id: 'MEXICO', name: 'Mexique', continent: 'NORTH_AMERICA', adjacent: ['WESTERN_UNITED_STATES', 'EASTERN_UNITED_STATES', 'CENTRAL_AMERICA'] },
  
  // EUROPE - 6 territories
  { id: 'ICELAND', name: 'Islande', continent: 'EUROPE', adjacent: ['GREENLAND', 'SCANDINAVIA', 'UNITED_KINGDOM'] },
  { id: 'SCANDINAVIA', name: 'Scandinavie', continent: 'EUROPE', adjacent: ['ICELAND', 'UNITED_KINGDOM', 'NORTHERN_EUROPE', 'URAL'] },
  { id: 'UNITED_KINGDOM', name: 'Royaume-Uni', continent: 'EUROPE', adjacent: ['ICELAND', 'SCANDINAVIA', 'NORTHERN_EUROPE', 'SOUTHERN_EUROPE'] },
  { id: 'NORTHERN_EUROPE', name: 'Europe du Nord', continent: 'EUROPE', adjacent: ['SCANDINAVIA', 'UNITED_KINGDOM', 'SOUTHERN_EUROPE', 'WESTERN_EUROPE'] },
  { id: 'SOUTHERN_EUROPE', name: 'Europe du Sud', continent: 'EUROPE', adjacent: ['UNITED_KINGDOM', 'NORTHERN_EUROPE', 'WESTERN_EUROPE', 'MIDDLE_EAST'] },
  { id: 'WESTERN_EUROPE', name: 'Europe de l\'Ouest', continent: 'EUROPE', adjacent: ['NORTHERN_EUROPE', 'SOUTHERN_EUROPE', 'MIDDLE_EAST'] },
  
  // AFRICA - 6 territories
  { id: 'EGYPT', name: 'Égypte', continent: 'AFRICA', adjacent: ['MIDDLE_EAST', 'SOUTHERN_EUROPE', 'NORTH_AFRICA', 'EAST_AFRICA'] },
  { id: 'NORTH_AFRICA', name: 'Afrique du Nord', continent: 'AFRICA', adjacent: ['EGYPT', 'EAST_AFRICA', 'WEST_AFRICA'] },
  { id: 'WEST_AFRICA', name: 'Afrique de l\'Ouest', continent: 'AFRICA', adjacent: ['NORTH_AFRICA', 'EAST_AFRICA', 'CENTRAL_AFRICA'] },
  { id: 'EAST_AFRICA', name: 'Afrique de l\'Est', continent: 'AFRICA', adjacent: ['EGYPT', 'NORTH_AFRICA', 'WEST_AFRICA', 'CENTRAL_AFRICA', 'SOUTH_AFRICA'] },
  { id: 'CENTRAL_AFRICA', name: 'Afrique Centrale', continent: 'AFRICA', adjacent: ['WEST_AFRICA', 'EAST_AFRICA', 'SOUTH_AFRICA'] },
  { id: 'SOUTH_AFRICA', name: 'Afrique du Sud', continent: 'AFRICA', adjacent: ['EAST_AFRICA', 'CENTRAL_AFRICA'] },
  
  // SOUTH_AMERICA - 4 territories
  { id: 'VENEZUELA', name: 'Venezuela', continent: 'SOUTH_AMERICA', adjacent: ['PERU', 'BRAZIL', 'CENTRAL_AMERICA'] },
  { id: 'PERU', name: 'Pérou', continent: 'SOUTH_AMERICA', adjacent: ['VENEZUELA', 'BRAZIL', 'ARGENTINA'] },
  { id: 'BRAZIL', name: 'Brésil', continent: 'SOUTH_AMERICA', adjacent: ['VENEZUELA', 'PERU', 'ARGENTINA', 'NORTH_AFRICA'] },
  { id: 'ARGENTINA', name: 'Argentine', continent: 'SOUTH_AMERICA', adjacent: ['PERU', 'BRAZIL'] },
  
  // OCEANIA - 4 territories
  { id: 'FIJI', name: 'Fidji', continent: 'OCEANIA', adjacent: ['NEW_GUINEA', 'WEST_AFRICA'] },
  { id: 'NEW_GUINEA', name: 'Nouvelle-Guinée', continent: 'OCEANIA', adjacent: ['INDONESIA', 'EAST_AFRICA', 'WEST_AFRICA'] },
  { id: 'AUSTRALIA', name: 'Australie', continent: 'OCEANIA', adjacent: ['NEW_GUINEA', 'FIJI'] },
  { id: 'NEW_ZEALAND', name: 'Nouvelle-Zélande', continent: 'OCEANIA', adjacent: ['AUSTRALIA', 'FIJI'] }
];

// Create a map of territory IDs to territory objects for easy lookup
const territoryMap = new Map();
territories.forEach(territory => {
  territoryMap.set(territory.id, new Territory(
    territory.id,
    territory.name,
    territory.continent,
    territory.adjacent
  ));
});

module.exports = { continents, territories, territoryMap };