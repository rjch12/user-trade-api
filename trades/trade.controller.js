const responseCode = require("_middleware/responseCodeHandler");
const tradeService = require("./trade.service");

// CRUD routes for trades operations.

module.exports = {
  create,
  update,
  delete: _delete,
  get,
  summary
};

// route functions

function summary (req, res) {
  tradeService
    .summary(req.query)
    .then((trades) => res.status(responseCode.SUCCESSFUL).send(trades))
    .catch((error) => res.status(responseCode.INVALID_PARAMS).send({ message: error })
    );
}

function get(req, res) {
  tradeService
    .getByTradeID(req.query)
    .then((trades) => res.status(responseCode.SUCCESSFUL).send(trades))
    .catch((error) => res.status(responseCode.INVALID_PARAMS).send({ message: error })
    );
}

function create(req, res) {
  tradeService
    .create(req.body)
    .then(() =>
      res.status(responseCode.SUCCESSFUL).send({ message: "Trade created" })
    )
    .catch((error) =>
      res.status(responseCode.INTERNAL_ERROR).send({ message: error })
    );
}

function update(req, res) {
  tradeService
    .update(req.body)
    .then(() => res.status(responseCode.SUCCESSFUL).send({ message: "Trade updated" }))
    .catch((error) =>
      res.status(responseCode.INTERNAL_ERROR).send({ message: error })
    );
}

function _delete(req, res) {
  tradeService
    .delete(req.query)
    .then(() => res.status(responseCode.SUCCESSFUL).send({ message: "Trade deleted" }))
    .catch((error) =>
      res.status(responseCode.INTERNAL_ERROR).send({ message: error })
    );
}

