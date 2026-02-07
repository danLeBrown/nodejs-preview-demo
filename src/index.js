require('dotenv').config();
const app = require('./app');
const { connect: connectDb, close: closeDb } = require('./db');
const { connect: connectRedis, close: closeRedis } = require('./redis');

const PORT = parseInt(process.env.PORT || '3000', 10);

async function main() {
    await connectDb().catch(err => {
      console.error('Failed to connect to database:', err.message);
      process.exit(1);
    });
    await (Promise.resolve(connectRedis())).catch(err => {
      console.error('Failed to connect to Redis:', err.message);
      process.exit(1);
    });

  const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });

  const shutdown = async () => {
    server.close();
    await closeRedis();
    await closeDb();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main();
