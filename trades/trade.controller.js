﻿const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("_middleware/validate-request");
const responseCode = require("_middleware/responseCodeHandler");
const tradeType = require("_helpers/tradeType");
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

// schema functions

function createSchema(req, res, next) {
  const schema = Joi.object({
    id: Joi.integer().required(),
    ticker: Joi.string().required().max(10, "utf8"),
    order: Joi.integer().greater("0").required(),
    price: Joi.integer().greater("0").required(),
    executionType: Joi.string().required().valid(tradeType.buy, tradeType.sell),
    executionDate: Joi.date().min("now").required(),
    userid: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    id: Joi.integer().required(),
    ticker: Joi.string().required(),
    order: Joi.integer().required(),
    price: Joi.integer().valid(tradeType.buy, tradeType.sell).required(),
    executionType: Joi.string().required().valid(),
    executionDate: Joi.string().min(6).required(),
    userid: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}
