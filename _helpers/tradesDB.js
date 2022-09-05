const config = require("config.json");
const { Client } = require("pg");

module.exports = db = {};

initialize();

async function initialize() {
  try {
    // create trades db in postgres if it doesn't already exist
    const { host, user, password, database, port } = config.trades;
    const client = await new Client({ user, host, database, password, port });
    await client.connect();
    await setupTradesTable(client, database);

    // init models and add them to the exported db object
    db.trades = client;
  } catch (e) {
    throw e;
  }
}

async function setupTradesTable(client, database) {
  let createTableQuery = `
      CREATE TABLE IF NOT EXISTS ${database}(
        id SERIAL PRIMARY KEY NOT NULL ,
        ticker VARCHAR (10) NOT NULL,
        orders INTEGER NOT NULL,
        price REAL NOT NULL,
        executionType varchar NOT NULL,
        executionStartDate TIMESTAMP NOT NULL,
        executionEndDate  TIMESTAMP NOT NULL,
        userId INTEGER NOT NULL );
        `;
  await client.query(createTableQuery);
}
