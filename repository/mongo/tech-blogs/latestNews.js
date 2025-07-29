let mongo = require("./mongo.js");
const collection = "latest-news";

module.exports = {
  getLatestNews: async () => {
    try {
      let db = await mongo.getDbConnection();
      let result = await db
        .collection(collection)
        .find({}, { projection: { _id: 0 } })
        .sort({ time: -1 })
        .toArray(); 

      return result;
    } catch (error) {
      console.error(`Error while fetching latest blogs from ${collection}:`, error);
      throw error;
    }
  },
  clearCollection: async () => {
    try {
      let db = await mongo.getDbConnection();
      let result = await db.collection(collection).deleteMany({});
      return result;
    } catch (error) {
      console.error(`Error while clearing collection ${collection}:`, error);
      throw error;
    }
  },
  bulkInsert: async (news) => {
    try {
      let db = await mongo.getDbConnection();
      let result = await db.collection(collection).insertMany(news);
      return result;
    } catch (error) {
      console.error(`Error while bulk inserting news in ${collection}:`, error);
      throw error;
    }
  },
};
