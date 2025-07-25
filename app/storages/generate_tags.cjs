const map = [
  {
    tags: ['di-cafe'],
    words: ['cà phê', 'cafe', 'coffee', 'ca-phe', 'phong-tra', 'tra-', '-tra'],
  },
  {
    tags: ['an-trua', 'an-toi'],
    words: ['banh-trang', 'restaurant', 'quan-an', 'quan-', 'my-quang', 'my',
      'bun-dau', 'nha-hang', 'banh-beo', 'banh-', 'com-', 'bep-', 'pho', 'bun', 'mi',
      'banh', 'tiem', 'hai-san', 'am-thuc', 'oc-', '-oc', 'goi-ca', 'garden'
    ],
  },
  {
    tags: ['an-sang'],
    words: ['my-quang', 'banh-beo', 'pho', 'bun', 'xoi', 'banh', 'my', 'tiem'],
  },
  {
    tags: ['an-chay'],
    words: [
      'chay'
    ]
  },
  {
    tags: ['an-nhau'],
    words: [
      'bia', 'restaurant', 'quan-an', 'quan-', 'nha-hang', 'beer', 'bar', 'pub', 'club', 'lounge',
      'hai-san', 'am-thuc', 'oc-', '-oc', 'goi-ca', 'garden'
    ]
  },
  {
    tags: ['an-vat'],
    words: [
      'banh-trang', 'banh-xeo', 'banh-mi', 'xoi', 'che', 'kem', 'tra-sua',
      'tra-sữa', 'trà-sữa', 'tra-sua', 'tra sua', 'tra-sua', 'cho', 'pho'
    ]
  }
];
// --- Auto-tagging logic ---
if (require.main === module) {
  const fs = require('fs');
  const path = require('path');
  const placesPath = path.join(__dirname, 'places.json');
  const places = JSON.parse(fs.readFileSync(placesPath, 'utf8'));

  function getTagsForAlias(alias) {
    let tags = [];
    for (const def of map) {
      for (const word of def.words) {
        if (alias.includes(word)) {
          tags = tags.concat(def.tags);
          break;
        }
      }
    }
    return Array.from(new Set(tags));
  }

  const updated = places.map(item => {
    const alias = item.alias || '';
    const foundTags = getTagsForAlias(alias);
    const mergedTags = Array.from(new Set([...(item.tags || []), ...foundTags]));
    return { ...item, tags: mergedTags };
  });

  fs.writeFileSync(placesPath, JSON.stringify(updated, null, 2), 'utf8');
  console.log('Tags added to places.json based on alias and definitions.');
}