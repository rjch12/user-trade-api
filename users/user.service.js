const mongoDB = require("_helpers/usersDB");
const helper = require("_helpers/helper");
const idService = require("../id/id.service");

module.exports = {
  getByEmail,
  create,
  updatePortfolio,
  removeTrade
  // delete: _delete,
};

async function getByEmail(email) {
  if (!email) throw "Missing param 'Email'";

  return await getUser(email);
}

async function create(body) {
  // validate if the user exists
  try {
    // try adding this email to the id table -> getting a new user id.
    await idService.create(body.email);
  } catch (e) {
    // email already exists. i.e. user for this email already exists.
    throw `Email id ${body.email} is already registered. Please use another email id`;
  }
  // get the user id of the newly created user.
  const user = await idService.getByEmail(body.email);
  const userDetails = {
    _id: user.rows[0].id,
    title: body.title,
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    transactions: body.transactions,
    contact_details: body.contact_details,
    country_code: body.country_code,
  };

  try {
    //   insert user details in mongoDB;
    await mongoDB.client.insertOne(userDetails);
    return userDetails;
  } catch (e) {
    throw 'Failed to register user "' + body.email + '". Please try again';
  }
}

// Depricating deletion as scope involves CRUD for Trades services only. Can be used in future.
async function _delete(body) {
  if (!body.email) throw "Missing param 'Email'";

  try {
    const idInfo = await idService.getByEmail(body.email);

    if (idInfo.rowCount === 0) throw "User not found";
    await idService.delete(body.email);
    await mongoDB.client.deleteOne({ _id: idInfo.rows[0].id });
    await helper.removeTrade(body.email);
  } catch (e) {
    throw e;
  }
}

// helper functions

async function getUser(email) {
  const id = await idService.getByEmail(email);

  if (id.rowCount === 0) throw "User not found";

  const user = await mongoDB.client.find({ _id: id.rows[0].id }).toArray();

  return user[0];
}

async function getUserByID(id) {
  try {
    const user = await mongoDB.client.find({ _id: id }).toArray();
    return user[0];
  } catch (e) {
    throw `User with id ${id} does not exists`;
  }
}

async function updatePortfolio(body, transactionID) {
  try {
    // validate if the user exists

    const userDetails = await getUserByID(body.userid);

    // update user transaction object with the new values for the given trade ID
    userDetails.transactions[transactionID] = {
      ticker: body.ticker,
      price: body.price,
      orders: body.orders,
      executionType: body.executionType,
      executionStartDate: body.executionStartDate,
      executionEndDate: body.executionEndDate
    };
    // update mongo db
    await mongoDB.client.updateOne({ _id: body.userid }, { $set: userDetails });

    // add ticker { price: quantity } details in mongoDB;
  } catch (e) {
    throw e.message;
  }
}

async function removeTrade(tradeid, userId) {
  const userDetails = await getUserByID(userId);
  if (!userDetails || userDetails.rowCount === 0)
    throw `User with User id ${userId} does not exists`;

  delete userDetails.transactions[tradeid];

  try {
    await mongoDB.client.updateOne({ _id: userId }, { $set: userDetails });

    //  add ticker { price: quantity } details in mongoDB;
  } catch (e) {
    throw e.message;
  }
}

