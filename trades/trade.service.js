const db = require("_helpers/tradesDB");
const helper = require("_helpers/helper");
const { database } = require("config.json").trades;
const moment = require("moment");
const idService = require("../id/id.service");

module.exports = {
  create,
  getByTradeID,
  update,
  delete: _delete,
  summary
};

async function getByTradeID(body) {
  if (!body.tradeid) throw "Mandatory Param 'tradeid' missing.";

  try {
    const trades = await getTradeByTradeID(Number(body.tradeid));
    if (!trades) {
      return { message: `No trades registered with Trade ID ${body.tradeid}`};
    }
    return trades;
  } catch (e) {
    throw e.message;
  }
}

async function create(body) {
  if (body.executionType != "buy" && body.executionType != "sell")
    throw "Invalid execution Type";
  if (new Date(body.executionEndDate) < new Date(moment().format()))
    throw "Cannot create trade with execution date in past";

  //validate user id present
  const user = await idService.getById(body.userid);
  
  if (user.rowCount != 0) {

    //Add to postgres sql the new trade tuple.
    await db.trades.query(
      `INSERT INTO ${database}(ticker, orders, price, executionType, executionStartDate, executionEndDate, userid) 
          VALUES('${body.ticker}', '${body.orders}', '${body.price}', '${body.executionType}', '${body.executionStartDate}', '${body.executionEndDate}', '${body.userid}');`
    );
  }

  //Add to user transactions object the ticker, quantity and price to mongodb the user.
  try {
    const tradeIDs = await getAllTradesFromUser(body);
    await helper.updatePortfolio(body, tradeIDs[tradeIDs.length - 1].id);
  } catch (e) {
    throw `User with User id ${body.userid} does not exists`;
  }
}

async function update(body) {
  //TODO
  if (new Date(body.executionEndDate) < new Date(moment().format()))
    throw "Cannot delete trade with execution date in past";

  const trades = await getTradeByTradeID(Number(body.tradeid));
  
  if (!trades) throw `Trade id ${body.tradeid} does not exists.`;
  if (trades.userid != body.userid)
    throw `User ${body.userid} does not have permission to delete trade id ${body.tradeid}`;

  //
  await helper.updatePortfolio(body, body.tradeid);
  await updateTradeInDB(body);
}

async function _delete(body) {
  if (new Date(body.executionEndDate) < new Date(moment().format()))
    throw "Cannot delete trade with execution date in past";

  const trades = await getTradeByTradeID(Number(body.tradeid));

  if (!trades) throw `Trade id ${body.tradeid} does not exists.`;
  if (trades.userid != body.userid)
    throw `User ${body.userid} does not have permission to delete trade id ${body.tradeid}`;

  await helper.removeTradeFromUser(trades);
  return await db.trades.query(
    `DELETE FROM ${database} WHERE id = ${Number(body.tradeid)};`
  );
}

async function summary(body) {
  let query = `SELECT * FROM ${database}`;
  
  let conditions = 0;
  
  if(body.userid) {
    conditions++;
    if(conditions === 1) query += ' WHERE'
    else if(conditions > 1) query += ' AND'
    query += ` userid = ${body.userid}`
  }

  if(body.executionType) {
    conditions++;
    if(conditions === 1) query += ' WHERE'
    else if(conditions > 1) query += ' AND'
    query += ` executionType = '${body.executionType}'`;
  }

  if(body.executionStartDate) {
    conditions++;
    if(conditions === 1) query += ' WHERE'
    else if(conditions > 1) query += ' AND'
    query += ` executionStartDate = '${body.executionStartDate}'`
  }
  if(body.executionEndDate) {
    conditions++;
    if(conditions === 1) query += ' WHERE'
    else if(conditions > 1) query += ' AND'
    query += ` executionEndDate = '${body.executionEndDate}'`
  }

  query += ';';

  try {
    const queryResult = await db.trades.query(query);
  if (!queryResult) throw "Invalid query";
  if (queryResult.rowCount === 0) return { message: "No matching Trades" };
  return queryResult.rows;
  }
  catch(e) { throw e.message; }

}


// helper functions

async function updateTradeInDB(body) {

  const queryResult = await db.trades.query(
    `UPDATE ${database} SET ticker = '${body.ticker}',
     orders = ${body.orders},
     price = ${body.price},
     executionType = '${body.executionType}',
     executionStartDate = '${body.executionStartDate}',
     executionEndDate = '${body.executionEndDate} '
     WHERE id = ${body.tradeid};`
  );
  if (!queryResult) throw "Trade could not be updated";
  return queryResult.rows[0];
}

async function getTradeByTradeID(tradeid) {
  const queryResult = await db.trades.query(
    `SELECT * FROM ${database} WHERE id = ${tradeid};`
  );
  if (!queryResult) throw "Trade ID not found";
  return queryResult.rows[0];
}

async function getAllTradesFromUser(body) {
  const queryResult = await db.trades.query(
    `SELECT id FROM ${database} 
    WHERE userid = ${body.userid} AND 
    ticker = '${body.ticker}' AND 
    orders = ${body.orders} AND 
    price = ${body.price} AND 
    executionType = '${body.executionType}' AND
    executionStartDate = '${body.executionStartDate}' AND
    executionEndDate = '${body.executionEndDate}';`
  );
  if (!queryResult) throw "Trade ID not found";
  return queryResult.rows;
}
