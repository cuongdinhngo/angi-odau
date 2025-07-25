const fs = require('fs');
const path = require('path');

const htmlFile = path.join(__dirname, 'food_places.html');
const jsonFile = path.join(__dirname, 'an_vat.json');

const html = fs.readFileSync(htmlFile, 'utf8');
let places = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

// Regex to match embedded restaurant JSON blocks
const jsonRegex = /var restaurants = \[(.+?)\];/s;
const match = html.match(jsonRegex);
if (!match) {
  console.error('No restaurant JSON found in HTML.');
  process.exit(1);
}

let restaurantData;
try {
  restaurantData = JSON.parse('[' + match[1].replace(/\n/g, '').replace(/\s+/g, ' ') + ']');
} catch (e) {
  console.error('Failed to parse restaurant JSON:', e);
  process.exit(1);
}

// Map lat/lng to places.json by alias/url
let updated = 0;
for (const r of restaurantData) {
  const alias = r.url;
  const lat = r.lat;
  const lng = r.lng;
  const place = places.find(p => p.alias === alias);
  if (place && lat && lng) {
    place.lat = lat;
    place.lng = lng;
    updated++;
  }
}

fs.writeFileSync(jsonFile, JSON.stringify(places, null, 2), 'utf8');
console.log(`Updated lat/lng for ${updated} places in places.json.`);
