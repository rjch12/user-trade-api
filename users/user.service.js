const e = require("express");
const mongoDB = require("_helpers/usersDB");
const idService = require("../id/id.service");

module.exports = {
  getByEmail,
  create,
  updatePortfolio,
  delete: _delete,
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
    portfolio: body.portfolio,
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

async function updatePortfolio(body) {
  try {
    // validate if the user exists
    const userDetails = await getUser(body.email);
    if (userDetails.rowCount === 0)
      throw `User with email id ${body.email} does not exists`;

    const ticker = body.ticker;
    const price = String(body.price);
    const orders = body.orders;

    //if user already has the same ticker symbols in portfolio
    if (userDetails.portfolio[ticker]) {
      //if user has the same ticker symbol with the same price in portfolio then add quantity.

      console.log(userDetails.portfolio.ticker);
      console.log(typeof(userDetails.portfolio.ticker));
      
      if (userDetails.portfolio.ticker[price]) {
        orders = orders + userDetails.portfolio.ticker.price.orders;
      }
    }
    userDetails.portfolio[ticker] = { [price]: orders };
    const id = Number(userDetails._id);

    await mongoDB.client.updateOne({ _id: id }, { $set: userDetails });

    //   add ticker { price: quantity } details in mongoDB;
  } catch (e) {
    throw e.message;
  }
}

async function _delete(email) {
  if (!email) throw "Missing param 'Email'";

  const idInfo = await idService.getByEmail(email);

  if (idInfo.rowCount === 0) throw "Email not found";
  await mongoDB.client.deleteOne({ _id: idInfo.rows[0].id });
  await idService.delete(email);
}

// helper functions

async function getUser(email) {
  const id = await idService.getByEmail(email);

  if (id.rowCount === 0) throw "Email not found";

  const user = await mongoDB.client.find({ _id: id.rows[0].id }).toArray();

  return user[0];
}
