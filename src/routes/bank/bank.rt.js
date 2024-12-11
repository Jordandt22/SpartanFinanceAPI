const bankRouter = require("express-promise-router")();
const {
  connectToBank,
  addBankAccountSpendingLimit,
  addBankCardSpendingLimit,
} = require("../../controllers/bank/bank.ct");
const { checkIfUserExist } = require("../../middleware/auth.mw");
const {
  schemas: {
    BankConnectionSchema,
    BASpendingLimitSchema,
    BCSpendingLimitSchema,
  },
  bodyValidator,
} = require("../../middleware/validator.mw");

// POST: Connect to Bank
bankRouter.post(
  "/connect",
  checkIfUserExist,
  bodyValidator(BankConnectionSchema),
  connectToBank
);

// POST: Add a spending limit to a bank account
bankRouter.post(
  "/limit/account",
  checkIfUserExist,
  bodyValidator(BASpendingLimitSchema),
  addBankAccountSpendingLimit
);

// POST: Add a spending limit to a bank card
bankRouter.post(
  "/limit/card",
  checkIfUserExist,
  bodyValidator(BCSpendingLimitSchema),
  addBankCardSpendingLimit
);

module.exports = bankRouter;
