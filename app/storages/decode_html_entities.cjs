// decode_html_entities.cjs
// Usage: node decode_html_entities.cjs
// Decodes HTML entities in places.json

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'an_vat.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

function decode(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&amp;/g, '&')
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

const updated = data.map(item => {
  const newItem = {};
  for (const key in item) {
    if (typeof item[key] === 'string') {
      newItem[key] = decode(item[key]);
    } else {
      newItem[key] = item[key];
    }
  }
  return newItem;
});

fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), 'utf8');
console.log('Decoded HTML entities in places.json');
