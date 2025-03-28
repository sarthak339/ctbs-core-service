const mongo = require("./mongo.js");
const collection = "category";

module.exports = {
  bulkInsert: async (model) => {
    try {
      let result = await (await mongo.getDbConnection()).collection(collection).insertMany(model);
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  count: async () => {
    try {
      let result =await (await mongo.getDbConnection()).collection(collection).countDocuments();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  findAll: async () => {
    try {
      let result =  await (await mongo.getDbConnection()).collection(collection).find({}).toArray();
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  findOne: async (model) => {
    try {
      let result = await (await mongo.getDbConnection()).collection(collection).findOne({ name: model.title });
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
