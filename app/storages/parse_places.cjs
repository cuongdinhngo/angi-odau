const fs = require('fs');
const path = require('path');

const htmlFile = path.join(__dirname, 'food_places.html');
const jsonFile = path.join(__dirname, 'an_vat.json');

const html = fs.readFileSync(htmlFile, 'utf8');


const regex = /<a href="([^"]+)"[^>]*class="item-restaurant[^"]*"[\s\S]*?<img[^>]*src="([^"]+)"[^>]*alt="([^"]+)"[\s\S]*?<h3 class="text-\[16px\] font-bold capitalize mb-2">([^<]+)<\/h3>[\s\S]*?<div class="text-split-2">([^<]+)<\/div>[\s\S]*?(\{[^}]+\})?/g;

let id = 1;
const places = [];
let match;
while ((match = regex.exec(html)) !== null) {
  let lat = null, lng = null;
  let alias = match[1].trim();
  let photo = match[2].trim();
  let name = match[4].trim();
  let address = match[5].trim();
  // Try to extract lat/lng from embedded JSON if present
  if (match[6]) {
    try {
      const json = JSON.parse(match[6].replace(/([a-zA-Z0-9_]+):/g, '"$1":'));
      lat = json.lat || null;
      lng = json.lng || null;
    } catch (e) {}
  }
  places.push({
    id: id++,
    name,
    address,
    lat,
    lng,
    alias,
    photo,
    description: "",
    openTime: "",
    closeTime: "",
    tags: []
  });
}

fs.writeFileSync(jsonFile, JSON.stringify(places, null, 2), 'utf8');

console.log(`Parsed ${places.length} places to places.json`);
