const mongo = require("./mongo");
const collection = "techNews";

module.exports = {
  insert: async function (model) {
    try {
      let result = await (await mongo.getDbConnection())
        .collection(collection)
        .insertMany(model);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  findByLink: async function (news) {
    try {
      let result = await (await mongo.getDbConnection())
        .collection(collection)
        .findOne({ link: news.link });
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  count: async function () {
    try {
      let result = await (await mongo.getDbConnection())
        .collection(collection)
        .count();
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  getNews: async function (page, pageSize, filter) {
    try { 
    const skip = (page - 1) * pageSize;
    const data = await (await mongo.getDbConnection()).collection(collection).find(filter, {projection:{_id:0}})
      .sort({ time: -1 }) 
      .skip(skip)
      .limit(pageSize)
      .toArray();
    return data;
      } catch (error) {
        throw error;
      }
  },
};
