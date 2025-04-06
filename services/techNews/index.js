const repo = require("../../repository");
const utils = require("../../utils");
const config = require("../config");

module.exports = {
  dailyTechNews: async function (req) {
    try {
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  fetchTechNews: async function (req) {
    try {
      const prompt = config.prompts.fetchTechNewsPrompt;
      const result = await utils.openAI.model.generateContent(prompt);
      const response = result.response;
      const topic = response.text().trim().replace(/"/g, ""); // Ensure clean output
      console.log(topic);
      return {
        result: {
          message: "Successfully fetched tech news",
        },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
