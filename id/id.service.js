const db = require("_helpers/idDB");
const { database } = require("config.json").id;

module.exports = {
  getByEmail,
  getById,
  create,
  delete: _delete,
};

async function getByEmail(email) {
  return await getUser(email);
}

async function getById(id) {
  const user = await db.id.query(
    `SELECT email FROM ${database} WHERE id = '${id}';`
  );
  if (!user) throw "id not found";
  return user;
}

async function create(email) {
  return await db.id.query(
    `INSERT INTO ${database}(email) VALUES('${email}');`
  );
}

async function _delete(email) {
  await db.id.query(
  `DELETE FROM ${database} WHERE email = '${email}'`);
}

// uuid helper function
async function getUser(email) {
  const user = await db.id.query(
    `SELECT id FROM ${database} WHERE email = '${email}';`
  );
  if (!user) throw "User not found";
  return user;
}
