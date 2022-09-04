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
        execution_type varchar NOT NULL,
        execution_date TIMESTAMP NOT NULL DEFAULT current_timestamp,
        email VARCHAR (255) NOT NULL );
        `;
  await client.query(createTableQuery);
}
