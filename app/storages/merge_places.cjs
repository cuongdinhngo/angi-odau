// merge_places.cjs
// Usage: node merge_places.cjs
// Merges district files into places.json

const fs = require('fs');
const path = require('path');

const districts = [
  'hai_chau.json',
  'hoa_vang.json',
  'cam_le.json',
  'lien_chieu.json',
  'ngu_hanh_son.json',
  'son_tra.json',
  'thanh_khe.json',
];

const dir = path.join(__dirname);
let merged = [];

districts.forEach(file => {
  const filePath = path.join(dir, file);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    merged = merged.concat(data);
  } else {
    console.warn(`File not found: ${filePath}`);
  }
});

const outPath = path.join(dir, 'places.json');
fs.writeFileSync(outPath, JSON.stringify(merged, null, 2), 'utf8');
console.log('Merged', merged.length, 'items into places.json');
