const axios = require("axios");

module.exports = {
  sendMessage: async (req, res, next) => {
    const { message } = req.body;
    try {
      const OpenAI = require("openai");
      const client = new OpenAI({
        baseURL: "https://api.studio.nebius.ai/v1/",
        apiKey: process.env.OPENAI_KEY,
      });

      const AIData = await client.chat.completions.create({
        temperature: 0.6,
        model: "meta-llama/Meta-Llama-3.1-70B-Instruct",
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 100,
      });

      res.json({ message: AIData.choices[0].message.content });
    } catch (error) {
      console.log(error.response);
      console.error("Error with OpenAI API:", error.message);
      res.status(500).json({
        error: "Failed to fetch response from OpenAI",
        details: error.message,
      });
    }
  },
};
