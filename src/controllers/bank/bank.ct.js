const UserModel = require("../../models/db");
const Axios = require("axios");
const { BANK_API_URI } = process.env;

module.exports = {
  connectToBank: async (req, res, next) => {
    const { uid } = req.user;
    const { bankEmail, bankPassword } = req.body;

    try {
      // Get Bank Info
      const dummyBankAPICall = await Axios.post(BANK_API_URI + "/users/auth", {
        email: bankEmail,
        password: bankPassword,
      });
      const bankData = dummyBankAPICall?.data?.user;

      // Check if a user is already connected to this bank
      const bankID = bankData._id;
      const bankAlreadyConnected = await UserModel.exists({
        bankID,
      });
      if (bankAlreadyConnected)
        return res.status(409).json({
          user: null,
          error: "An account has already connected to this bank.",
        });

      // Add Bank ID to User Data
      const updatedUser = await UserModel.findOneAndUpdate(
        { uid },
        {
          bankID,
        },
        { returnDocument: "after" }
      );

      return res.status(200).json({
        user: { ...updatedUser._doc, bankInfo: bankData },
        error: null,
      });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ user: null, error: "There was an error on the server." });
    }
  },
  addBankAccountSpendingLimit: async (req, res, next) => {
    const { bankAccountID, limit } = req.body;
    const { uid, spendingLimits } = req.user;
    const filteredSpendingLimits = spendingLimits.accounts.filter(
      (acc) => acc.bankAccountID !== bankAccountID
    );

    try {
      // Add Bank ID to User Data
      const updatedUser = await UserModel.findOneAndUpdate(
        { uid },
        {
          spendingLimits: {
            ...spendingLimits,
            accounts: [...filteredSpendingLimits, { limit, bankAccountID }],
          },
        },
        { returnDocument: "after" }
      );

      return res.status(200).json({
        user: { ...updatedUser._doc },
        error: null,
      });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ user: null, error: "There was an error on the server." });
    }
  },
  addBankCardSpendingLimit: async (req, res, next) => {
    const { bankCardID, limit } = req.body;
    const { uid, spendingLimits } = req.user;
    const filteredSpendingLimits = spendingLimits.cards.filter(
      (card) => card.bankCardID !== bankCardID
    );

    try {
      // Add Bank ID to User Data
      const updatedUser = await UserModel.findOneAndUpdate(
        { uid },
        {
          spendingLimits: {
            ...spendingLimits,
            cards: [...filteredSpendingLimits, { limit, bankCardID }],
          },
        },
        { returnDocument: "after" }
      );

      return res.status(200).json({
        user: { ...updatedUser._doc },
        error: null,
      });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ user: null, error: "There was an error on the server." });
    }
  },
};
