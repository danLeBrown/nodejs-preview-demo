const express = require('express');
const { getDb } = require('../db');
const { getClient: getRedisClient } = require('../redis');

const router = express.Router();
const COUNTER_KEY = 'preview:counter';
const ITEMS_COLLECTION = 'items';

router.get('/items', async (_req, res) => {
  try {
    const db = getDb();
    if (!db) return res.status(503).json({ error: 'Database not connected' });

    const items = await db
      .collection(ITEMS_COLLECTION)
      .find({})
      .sort({ createdAt: 1 })
      .project({ _seed: 0 })
      .toArray();

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/items', async (req, res) => {
  try {
    const name = req.body && req.body.name;
    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Body must include { "name": "..." }' });
    }

    const db = getDb();
    if (!db) return res.status(503).json({ error: 'Database not connected' });

    const doc = {
      name: name.trim(),
      createdAt: new Date(),
    };
    const result = await db.collection(ITEMS_COLLECTION).insertOne(doc);
    const created = { _id: result.insertedId, ...doc };
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/counter', async (_req, res) => {
  try {
    const redis = getRedisClient();
    if (!redis) return res.status(503).json({ error: 'Redis not connected' });

    const value = await redis.get(COUNTER_KEY);
    const count = value === null ? 0 : parseInt(value, 10);
    res.json({ value: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/counter', async (_req, res) => {
  try {
    const redis = getRedisClient();
    if (!redis) return res.status(503).json({ error: 'Redis not connected' });

    const value = await redis.incr(COUNTER_KEY);
    res.json({ value });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
