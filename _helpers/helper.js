const userService = require("../users/user.service");
const tradeService = require("../trades/trade.service");
const idService = require("../id/id.service");

module.exports = {
  updatePortfolio,
  removeTradeFromUser,
  getUserDetails
};

async function updatePortfolio (body, id) {
    return await userService.updatePortfolio(body, id);
}

async function removeTradeFromUser(body) {
  await userService.removeTrade(body.id, body.userid);
}

async function getUserDetails (body, id) {
return await userService.getUserByID(body, id);
}