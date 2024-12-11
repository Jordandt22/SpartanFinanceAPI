require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const rateLimiter = require("express-rate-limit");
const slowDown = require("express-slow-down");
const { authUser } = require("./middleware/auth.mw");
const connect = require("./models/db");
const app = express();

// Middleware
const { NODE_ENV, WEB_URL } = process.env;
const notProduction = NODE_ENV !== "production";
app.use(helmet());
app.use(
  cors({
    origin: notProduction ? "http://localhost:3000" : WEB_URL,
  })
);
app.use(express.json());
if (notProduction) {
  app.use(morgan("dev"));
} else {
  app.enable("trust proxy");
  app.set("trust proxy", 1);
}

// Rate & Speed Limiter Info
const timeLimit = 1000 * 60 * 15;
const maxReq = 75;
const limiter = rateLimiter({
  windowMs: timeLimit,
  max: maxReq,
});
const speedLimiter = slowDown({
  windowMs: timeLimit,
  delayAfter: maxReq / 2,
  delayMs: () => 500,
});

// Rate & Speed Limiters
app.use(speedLimiter);
app.use(limiter);

// Mongoose Connection
connect();

// Landing Page Route
app.get("/", (req, res) => {
  res.send("Spartan Finance API is Up and Running !");
});

// API Routes

// Users
app.use(
  `/v${process.env.API_VERSION}/api/users`,
  require("./routes/user/user.rt")
);

// Bank
app.use(
  `/v${process.env.API_VERSION}/api/bank/:uid`,
  authUser,
  require("./routes/bank/bank.rt")
);

// AI
app.use(`/v${process.env.API_VERSION}/api/AI`, require("./routes/AI/AI.rt"));

// PORT and Sever
const PORT = process.env.PORT || 4000;
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`CORS Enabled Server, Listening to port: ${PORT}...`);
});

// Export the Express API
module.exports = server;
