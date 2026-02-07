require('dotenv').config();
const { connect: connectDb, getDb, close: closeDb } = require('../src/db');
const { connect: connectRedis, getClient: getRedis, close: closeRedis } = require('../src/redis');

const SEED_MARKER = 'preview-demo-seed-v1';
const COUNTER_KEY = 'preview:counter';

const DEMO_ITEMS = [
  { name: 'Preview environment', createdAt: new Date(), _seed: SEED_MARKER },
  { name: 'MongoDB and Redis', createdAt: new Date(), _seed: SEED_MARKER },
  { name: 'Health and API', createdAt: new Date(), _seed: SEED_MARKER },
];

async function main() {
  try {
    await connectDb();
    connectRedis();

    const db = getDb();
    const redis = getRedis();
    const items = db.collection('items');

    const existing = await items.findOne({ _seed: SEED_MARKER });
    if (existing) {
      console.log('Seed already applied (idempotent skip).');
    } else {
      await items.insertMany(DEMO_ITEMS);
      console.log('Inserted demo items.');
    }

    const count = await redis.get(COUNTER_KEY);
    if (count === null) {
      await redis.set(COUNTER_KEY, 0);
      console.log('Initialized Redis counter to 0.');
    } else {
      console.log('Redis counter already set (idempotent skip).');
    }

    console.log('Seed complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  } finally {
    await closeRedis();
    await closeDb();
  }
}

main();
