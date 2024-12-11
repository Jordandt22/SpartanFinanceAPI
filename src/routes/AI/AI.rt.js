const AIRouter = require("express-promise-router")();
const { sendMessage } = require("../../controllers/AI/AI.ct");

// POST: Send Message to AI
AIRouter.post("/message", sendMessage);

module.exports = AIRouter;
