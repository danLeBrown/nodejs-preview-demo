const { MongoClient } = require('mongodb');

let client = null;
let defaultDb = null;

async function connect() {
  const uri = process.env.DATABASE_URL || 'mongodb://mongodb:27017/preview-demo';
  client = new MongoClient(uri);  
  await client.connect();
  const dbName = new URL(uri).pathname.slice(1) || 'preview-demo';
  defaultDb = client.db(dbName);

  return client;
}

function getClient() {
  return client;
}

function getDb() {
  return defaultDb;
}

async function close() {
  if (client) {
    await client.close();
    client = null;
    defaultDb = null;
  }
}

module.exports = {
  connect,
  getClient,
  getDb,
  close,
};
