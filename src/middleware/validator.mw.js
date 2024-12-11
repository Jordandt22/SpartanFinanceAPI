const Yup = require("yup");

// ---- User Schemas ----
const UserSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .min(1, "Please enter a valid email.")
    .max(100, "Your email exceeds the character limit (100).")
    .email("Please enter a valid email.")
    .required("Please enter a valid email."),
  username: Yup.string()
    .trim()
    .min(1, "Please create a username.")
    .max(100, "Your username exceeds the character limit (100).")
    .required("Please create a username."),
});

const UserFinancalInfoSchema = Yup.object().shape({
  monthlyIncome: Yup.number()
    .min(0, "Value must be between 0 and 1 million.")
    .max(1000 * 1000, "Value must be between 0 and 1 million.")
    .required("Must enter your monthly income."),
  monthlySpending: Yup.number()
    .min(0, "Value must be between 0 and 1 million.")
    .max(1000 * 1000, "Value must be between 0 and 1 million.")
    .required("Must enter your monthly spending."),
  monthlySavings: Yup.number()
    .min(0, "Value must be between 0 and 1 million.")
    .max(1000 * 1000, "Value must be between 0 and 1 million.")
    .required("Must enter your monthly savings."),
});

// ---- Bank Schemas ----
const BankConnectionSchema = Yup.object().shape({
  bankEmail: Yup.string()
    .trim()
    .min(1, "Please enter a valid email.")
    .max(100, "Your email exceeds the character limit (100).")
    .email("Please enter a valid email.")
    .required("Please enter a valid email."),
  bankPassword: Yup.string()
    .trim()
    .min(1, "Please enter your password.")
    .max(300, "Your password exceeds the character limit (300).")
    .required("Please enter your password."),
});

const BASpendingLimitSchema = Yup.object({
  bankAccountID: Yup.string()
    .min(1, "A Bank Account ID is required.")
    .max(1000, "Bank Account ID exceeds max character limit (1000).")
    .required("A Bank Account ID is required."),
  limit: Yup.number()
    .min(1, "A spending limit is required.")
    .max(1000 * 1000, "The max value is 1 million.")
    .required("A spending limit is required."),
});

const BCSpendingLimitSchema = Yup.object({
  bankCardID: Yup.string()
    .min(1, "A Bank Account ID is required.")
    .max(1000, "Bank Account ID exceeds max character limit (1000).")
    .required("A Bank Account ID is required."),
  limit: Yup.number()
    .min(1, "A spending limit is required.")
    .max(1000 * 1000, "The max value is 1 million.")
    .required("A spending limit is required."),
});

module.exports = {
  schemas: {
    UserSchema,
    UserFinancalInfoSchema,
    BankConnectionSchema,
    BASpendingLimitSchema,
    BCSpendingLimitSchema,
  },
  bodyValidator: (schema) => async (req, res, next) => {
    try {
      await schema.validate({
        ...req.body,
      });

      next();
    } catch (err) {
      const { errors } = err;
      res.status(422).json({ message: "Invalid data.", formErrors: errors });
    }
  },
};
