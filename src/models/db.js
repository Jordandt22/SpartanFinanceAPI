const mongoose = require("mongoose");

const connect = mongoose.connect(
  `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.htm2g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
);

// Check if database connected
connect
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch((error) => {
    console.log("Database cannot be connected.", error);
  });

// Spending Limit Schemas
const bankAccountSpendingLimitSchema = new mongoose.Schema({
  bankAccountID: String,
  limit: Number,
});

const bankCardSpendingLimitSchema = new mongoose.Schema({
  bankCardID: String,
  limit: Number,
});

// User Schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  username: {
    type: String,
  },
  uid: {
    type: String,
  },
  bankID: {
    type: String,
  },
  financialInfo: {
    monthlyIncome: Number,
    monthlySpending: Number,
    monthlySavings: Number,
  },
  spendingLimits: {
    accounts: [bankAccountSpendingLimitSchema],
    cards: [bankCardSpendingLimitSchema],
  },
});

// Collection part
const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
