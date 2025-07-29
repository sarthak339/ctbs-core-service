let mongo = require("./mongo.js");
const collection = "subscribed-users";

module.exports = {
  addSubscriber: async (subscriberData) => {
    try {
      if (!subscriberData || !subscriberData.email) {
        throw new Error("Subscriber data must include an email");
      }

      let db = await mongo.getDbConnection();

      // Check if the subscriber already exists
      const existing = await db.collection(collection).findOne({ email: subscriberData.email });
      if (existing) {
        return { success: false, message: "Subscriber already exists" };
      }

      // Add createdAt timestamp and insert new subscriber
      const newSubscriber = {
        ...subscriberData,
        createdAt: new Date(),
      };

      const result = await db.collection(collection).insertOne(newSubscriber);

      return {
        success: true,
        message: "Subscriber added successfully",
        id: result.insertedId,
      };
    } catch (error) {
      console.error(`Error while adding subscriber to ${collection}:`, error);
      throw error;
    }
  },
};
