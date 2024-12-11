const userRouter = require("express-promise-router")();
const {
  createUser,
  getUser,
  deleteUser,
  updateFinancialInfo,
  updateUserInfo,
} = require("../../controllers/user/user.ct");
const { authUser, checkIfUserExist } = require("../../middleware/auth.mw");
const {
  bodyValidator,
  schemas: { UserSchema, UserFinancalInfoSchema },
} = require("../../middleware/validator.mw");

// POST: Create User
userRouter.post("/:uid", authUser, bodyValidator(UserSchema), createUser);

// GET: Get User
userRouter.get("/:uid", authUser, checkIfUserExist, getUser);

// DELETE: Delete User
userRouter.delete("/:uid", authUser, deleteUser);

// PATCH: Update User Info
userRouter.patch("/:uid/info", authUser, checkIfUserExist, updateUserInfo);

// ---- Financial Information ----

// PATCH: Update User Financial Information
userRouter.patch(
  "/:uid/financial",
  authUser,
  checkIfUserExist,
  bodyValidator(UserFinancalInfoSchema),
  updateFinancialInfo
);

module.exports = userRouter;
