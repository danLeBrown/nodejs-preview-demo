const { MongoClient } = require('mongodb');

let client = null;
let defaultDb = null;

async function connect() {
  const uri = process.env.DATABASE_URL || 'mongodb://mongodb:27017/preview-demo';
  client = new MongoClient(uri);
  console.log('uri', uri);
  // console.log('client', client); 
  
  await client.connect();
  const dbName = new URL(uri).pathname.slice(1) || 'preview-demo';
  console.log('dbName', dbName);
  defaultDb = client.db(dbName);
  // console.log('defaultDb', defaultDb);

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
