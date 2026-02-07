require('dotenv').config();
const { connect, getDb, close } = require('../src/db');

const MIGRATIONS = [
  {
    id: '001_create_items_index',
    async run(db) {
      const coll = db.collection('items');
      await coll.createIndex({ createdAt: 1 });
    },
  },
];

async function main() {
  try {
    await connect();
    const db = getDb();
    const ran = db.collection('migrations');

    for (const m of MIGRATIONS) {
      const existing = await ran.findOne({ id: m.id });
      if (existing) {
        console.log(`Skip (already run): ${m.id}`);
        continue;
      }
      await m.run(db);
      await ran.insertOne({ id: m.id, runAt: new Date() });
      console.log(`Ran: ${m.id}`);
    }

    console.log('Migrations complete.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    await close();
  }
}

main();
