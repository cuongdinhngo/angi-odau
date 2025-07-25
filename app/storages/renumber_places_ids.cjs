// renumber_places_ids.cjs
// Usage: node renumber_places_ids.cjs
// Reassigns unique sequential ids to all items in places.json

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'places.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const updated = data.map((item, idx) => ({
  ...item,
  id: idx + 1
}));

fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), 'utf8');
console.log('All ids updated to be unique and sequential, starting from 1.');
