const config = require("config.json");
const { Client } = require("pg");

module.exports = rdbms = {};

initialize();

async function initialize() {
  try {
    // create id db in postgres if it doesn't already exist
    const { host, user, password, database, port } = config.id;
    const client = await new Client({ user, host, database, password, port });
    await client.connect();
    await setupIdTable(client, database);

    // init models and add them to the exported db object
    rdbms.id = client;
  } catch (e) {
    throw e;
  }
}

async function setupIdTable(client, database) {

  let createTableQuery = `
      CREATE TABLE IF NOT EXISTS ${database}(
        email varchar PRIMARY KEY NOT NULL,
        id SERIAL NOT NULL);
        `;
  await client.query(createTableQuery);
}
