const { date } = require("joi");
const db = require("_helpers/tradesDB");
const { database } = require("config.json").trades;
const moment = require('moment');

module.exports = {
  getById,
  create,
  update,
  delete: _delete,
};

async function getById(id) {
  return await getTrade(id);
}

async function create(params) {
 if(new Date(params.executionDate) < new Date(moment().format()))
  throw 'Cannot create trade with execution date in past';


  try {

    //Add to postgres sql the new trade tuple.
    await db.trades.query(
      `INSERT INTO ${database}(ticker, orders, price, execution_type, execution_date, email) 
      VALUES('${params.ticker}', '${params.orders}', '${params.price}', '${params.executionType}', '${params.executionDate}', '${params.email}');`);

    //Add to ticker, quantity and price to mongodb the user.
      
    }
    catch(e) {
      throw e;
    }
}

async function update(id, params) {
  const user = await getTrade(id);

  // validate
  const emailChanged = params.email && user.email !== params.email;
  if (
    emailChanged &&
    (await db.trades.Trades.findOne({ where: { email: params.email } }))
  ) {
    throw 'Email "' + params.email + '" is already registered';
  }

  // copy params to user and save
  Object.assign(user, params);
  await user.save();
}

async function _delete(id) {
  const user = await getTrade(id);
  await user.destroy();
}

// helper functions

async function getTrade(id) {
  const queryResult = await db.trades.query(
    `SELECT * FROM ${database} WHERE id = ${id};`
  );
  if (!queryResult) throw "User not found";
  return queryResult;
  // console.log(`Database entries for ${name}: ${entries.rowCount} row(s)`);
  // console.log(Object.keys(entries.rows?.[0]).join('\t'));
  // console.log(`${entries.rows.map((r) => Object.values(r).join('\t')).join('\n')}`);
  // await client.end();
}
