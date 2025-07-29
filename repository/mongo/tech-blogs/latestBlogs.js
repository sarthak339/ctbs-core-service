let mongo = require("./mongo.js");
const collection = "latest-blogs";

module.exports = {
  getLatestBlogs: async () => {
    try {
      let db = await mongo.getDbConnection();
      let result = await db
        .collection(collection)
        .find({}, { projection: { _id: 0 } })
        .sort({ publishedDate: -1 })
        .toArray();

      return result;
    } catch (error) {
      console.error(
        `Error while fetching latest blogs from ${collection}:`,
        error
      );
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
  bulkInsert: async (blogs) => {
    try {
      let db = await mongo.getDbConnection();
      let result = await db.collection(collection).insertMany(blogs);
      return result;
    } catch (error) {
      console.error(
        `Error while bulk inserting blogs in ${collection}:`,
        error
      );
      throw error;
    }
  },
};
