const express = require('express');
const { getClient: getMongoClient } = require('../db');
const { getClient: getRedisClient } = require('../redis');

const router = express.Router();

router.get('/', async (_req, res) => {
  const result = { status: 'ok', mongodb: 'ok', redis: 'ok' };

  const mongo = getMongoClient();
  if (mongo) {
    try {
      await mongo.db().admin().ping();
    } catch (err) {
      result.status = 'degraded';
      result.mongodb = 'error';
      result.mongodbError = err.message;
    }
  } else {
    result.status = 'degraded';
    result.mongodb = 'error';
    result.mongodbError = 'Not connected';
  }

  const redis = getRedisClient();
  if (redis) {
    try {
      await redis.ping();
    } catch (err) {
      result.status = 'degraded';
      result.redis = 'error';
      result.redisError = err.message;
    }
  } else {
    result.status = 'degraded';
    result.redis = 'error';
    result.redisError = 'Not connected';
  }

  const statusCode = result.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(result);
});

module.exports = router;
