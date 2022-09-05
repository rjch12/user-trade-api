require('rootpath')();
const express = require('express');
const app = express();
//service controlles
const trade = require("./trades/trade.controller");
const users = require("./users/user.controller");
const responseCode = require("_middleware/responseCodeHandler");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (request, response) => {
  response.status(responseCode.SUCCESSFUL).send("Users - Trades API home");
});


// User end points

app.post("/users/createUser/", (req, res) => {
  users.create(req, res);
});

app.get("/users/getUser/", (req, res) => {
  users.getByEmail(req, res);
});

// Trades endpoints listeners

app.post("/trade/createTrade/", (req, res) => {
  trade.create(req, res);
});

app.get("/trade/getTrade/", (req, res) => {
  trade.get(req, res);
});

app.put("/trade/updateTrade/", (req, res) => {
  trade.update(req, res);
});

app.post("/trade/deleteTrade/", (req, res) => {
  trade.delete(req, res);
});

//Query endpoint
/*
Build a query endpoint that takes the following parameters (all optional) and returns the aggregated trade
summary
a. UserId
b. executionStartDate
c. executionEndDate
d. executionType
*/

app.get("/trades/getSummary/", (req, res) => {
  trade.summary(req, res);
});


// start server
const port = process.env.PORT || 4000;
app.listen(port, () => console.log("Server listening on port " + port));
