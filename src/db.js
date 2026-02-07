const { MongoClient } = require('mongodb');

let client = null;
let defaultDb = null;

async function connect() {
  const uri = process.env.DATABASE_URL || 'mongodb://localhost:27017/preview-demo';
  client = new MongoClient(uri);
  await client.connect();
  const dbName = new URL(uri).pathname.slice(1) || 'preview-demo';
  defaultDb = client.db(dbName);

  console.log('uri', uri);
  console.log('dbName', dbName);
  // console.log('client', client);
  console.log('defaultDb', defaultDb);
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
