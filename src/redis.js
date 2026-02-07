const Redis = require('ioredis');

let redis = null;

function connect() {
  const url = process.env.REDIS_URL || 'redis://redis:6379';
  redis = new Redis(url);
  return redis;
}

function getClient() {
  return redis;
}

async function close() {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}

module.exports = {
  connect,
  getClient,
  close,
};
