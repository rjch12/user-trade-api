const responseCode = require("_middleware/responseCodeHandler");
const userService = require("./user.service");

// CRUD routes for trades operations.

module.exports = {
  getByEmail,
  create,
  update,
  delete: _delete,
};

// route functions

function getByEmail(req, res) {
  userService
    .getByEmail(req.query.email)
    .then((user) => res.status(responseCode.SUCCESSFUL).send(user)) 
    .catch((error) => res.status(responseCode.BAD_REQUEST).send({message: error}));
}

function create(req, res) {
  userService
    .create(req.body)
    .then(() => res.status(responseCode.SUCCESSFUL).send({ message: "User created" }))
    .catch((error) => res.status(responseCode.BAD_REQUEST).send({message: error}));
  }

function update(req, res) {
  userService
    .getByEmail(req.query.email)
    .then((user) => res.status(responseCode.SUCCESSFUL).send(user)) 
    .catch((error) => res.status(responseCode.BAD_REQUEST).send({message: error}));
  }
  
function _delete(req, res) {
  userService
    .delete(req.query)
    .then(() => res.status(responseCode.SUCCESSFUL).send({ message: "User deleted" }))
    .catch((error) => res.status(responseCode.BAD_REQUEST).send({message: error}));
}
