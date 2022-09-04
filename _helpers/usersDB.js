const config = require("config.json");
const MongoClient = require("mongodb").MongoClient;

module.exports = userDb = {};

initialize();

async function initialize() {
  // get collection instance from mongodb.

  const { url, database, collection } = config.users;

  const client = new MongoClient(url);
 
  try {
      // Connect to the MongoDB cluster
      await client.connect();

  } catch (e) {
      throw e;
  } 
  userDb.client = client.db(database).collection(collection);
}
