
// Usage: bun run migrate_food_places.cjs

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const tableName = 'food_places';

const filePath = path.join(__dirname, '../storages/places.json');

const rawData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const data = rawData.map(({ openTime, closeTime, ...rest }) => ({
  ...rest,
  open_time: openTime,
  close_time: closeTime
}));

async function migrate() {
  const { error, count } = await supabase.from(tableName).upsert(data, { count: 'exact' });
  if (error) {
    console.error('Bulk upsert error:', error);
  } else {
    console.log(`Total is ${data.length}, Bulk upserted ${count} items into ${tableName}.`);
  }
  console.log('Migration complete.');
}

migrate();
