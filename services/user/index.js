const repo = require("../../repository");

module.exports = {
  addSubscriber: async function (email) {
    try {
      if (!email || typeof email !== "string") {
        throw new Error("A valid email address is required");
      }

      // Prepare subscriber object
      const subscriberData = { email: email.trim() };

      // Call repo function
      let result = await repo.mongo.techBlogs.user.addSubscriber(
        subscriberData
      );

      if (!result.success) {
        return { success: false, message: result.message };
      }

      return {
        success: true,
        message: result.message,
      };
    } catch (error) {
      console.error("Error in service addSubscriber:", error);
      throw error;
    }
  },
};
