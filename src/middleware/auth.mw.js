const { verifyAccessToken } = require("../firebase/firebase.functions");
const UserModel = require("../models/db");

module.exports = {
  authUser: async (req, res, next) => {
    const { uid } = req.params;

    // FIREBASE AUTH
    const accessToken = req.headers?.authorization?.replace("Bearer ", "");
    if (!accessToken)
      return res.status(422).json({
        user: null,
        error: { message: "Must provide credentials." },
      });

    const decodedToken = await verifyAccessToken(accessToken);
    if (uid !== decodedToken?.uid)
      return res.status(401).json({
        user: null,
        error: { message: "Must provide valid credentials." },
      });

    req.uid = uid;
    req.body = { ...req.body };
    return next();
  },
  checkIfUserExist: async (req, res, next) => {
    const uid = req.uid;

    // Find the user document by UID
    const user = await UserModel.findOne({ uid });

    // User not found
    if (!user)
      return res.status(404).json({ user: null, error: "User not found" });

    req.user = user;
    req.body = { ...req.body };
    return next();
  },
};
