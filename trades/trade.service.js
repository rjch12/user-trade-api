const { date } = require("joi");
const db = require("_helpers/tradesDB");
const { database } = require("config.json").trades;
const moment = require("moment");
const userService = require("../users/user.service");
const idService = require("../id/id.service");

module.exports = {
  get,
  create,
  update,
  delete: _delete,
};

async function get(body) {
  if (!body.email && !body.id) throw "Please pass either email or userID";

  try {
    if (body.email) {
      const trades = await getTradeByEmail(body.email);
      if(trades.length === 0) { return {message: 'No trades registered with this email'}} 
      return trades;

    } else if (body.id) {
      const trades = await getTradeByID(Number(body.id));
      if(trades.length === 0) { return {message: 'No trades registered with this trade ID'}}
      return trades;
    }
    
  } catch (e) {
    throw e.message;
  }
}

async function create(body) {
  if (new Date(body.executionDate) < new Date(moment().format()))
    throw "Cannot create trade with execution date in past";

  try {
    //Add to postgres sql the new trade tuple.
    await db.trades.query(
      `INSERT INTO ${database}(ticker, orders, price, execution_type, execution_date, email) 
        VALUES('${body.ticker}', '${body.orders}', '${body.price}', '${body.executionType}', '${body.executionDate}', '${body.email}');`
    );

    //Add to ticker, quantity and price to mongodb the user.
    await userService.updatePortfolio(body);
  } catch (e) {
    // TODO make a rollback query from trades and user's portfolio databases.
    throw e;
  }
}

async function update(id, body) {
  const user = await getTrade(id);

  // validate
  const emailChanged = body.email && user.email !== body.email;
  if (
    emailChanged &&
    (await db.trades.Trades.findOne({ where: { email: body.email } }))
  ) {
    throw 'Email "' + body.email + '" is already registered';
  }

  // copy body to user and save
  Object.assign(user, body);
  await user.save();
}

async function _delete(id) {
  const user = await getTradeByID(id);
  await user.destroy();
}

// helper functions

async function getTradeByID(id) {
  const queryResult = await db.trades.query(
    `SELECT * FROM ${database} WHERE id = ${id};`
  );
  if (!queryResult) throw "Trade ID not found";
  return queryResult.rows;
}

async function getTradeByEmail(email) {
  const queryResult = await db.trades.query(
    `SELECT * FROM ${database} WHERE email = '${email}';`
  );
  if (!queryResult) throw "User ID not found";
  return queryResult.rows;
}
