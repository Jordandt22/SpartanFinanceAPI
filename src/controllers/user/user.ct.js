const UserModel = require("../../models/db");
const Axios = require("axios");
const { BANK_API_URI } = process.env;

module.exports = {
  createUser: async (req, res, next) => {
    // Checking if the Account Already Exists
    const { uid } = req.params;
    const accountAlreadyExists = await UserModel.exists({
      uid,
    });
    if (accountAlreadyExists)
      return res.status(422).json({
        user: null,
        error: { message: "This account has already been created." },
      });

    // Check if an account with the email already exists
    const { email, username } = req.body;
    const emailAlreadyExists = await UserModel.exists({
      email,
    });
    if (emailAlreadyExists)
      return res.status(422).json({
        user: null,
        error: { message: "An account with this email already exists." },
      });

    // Create Database User
    const user = await UserModel.create({
      email,
      username,
      uid,
    });

    res.status(200).json({ user: { ...user, bankInfo: null }, error: null });
  },
  getUser: async (req, res) => {
    try {
      const user = req.user;

      // Check if the User has Connected to a Bank
      if (!user.bankID)
        return res
          .status(200)
          .json({ user: { ...user._doc, bankInfo: null }, error: null });

      // Find Bank Info and Retrieve Info from Dummy Bank
      const dummyBankAPICall = await Axios.get(
        BANK_API_URI + `/users/${user.bankID}`
      );
      const bankData = dummyBankAPICall?.data?.user;

      res
        .status(200)
        .json({ user: { ...user._doc, bankInfo: bankData }, error: null });
    } catch (error) {
      // Error occurred while fetching user information
      console.error("Error fetching user information:", error);
      res.status(500).json({ user: null, error: "Internal server error" });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const { uid } = req.params;

      // Find the user by uid and delete it
      const user = await UserModel.findOneAndDelete({ uid });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ message: "User deleted successfully", user });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  updateUserInfo: async (req, res, next) => {
    const { username } = req.body;
    try {
      const { uid } = req.user;
      const updatedUser = await UserModel.findOneAndUpdate(
        { uid },
        {
          username,
        },
        { returnDocument: "after" }
      );

      res.status(200).json({
        user: { ...updatedUser._doc },
        error: null,
      });
    } catch (error) {
      // Error occurred while fetching user information
      console.error("Error updating user's username:", error);
      res.status(500).json({ user: null, error: "Internal server error" });
    }
  },

  // Financial Information
  updateFinancialInfo: async (req, res) => {
    const { monthlyIncome, monthlySpending, monthlySavings } = req.body;

    try {
      const { uid } = req.user;
      const updatedUser = await UserModel.findOneAndUpdate(
        { uid },
        {
          financialInfo: {
            monthlyIncome,
            monthlySpending,
            monthlySavings,
          },
        },
        { returnDocument: "after" }
      );

      res.status(200).json({ user: updatedUser, error: null });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ user: null, error: "Internal server error" });
    }
  },
};
