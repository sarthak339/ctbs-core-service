let mongo = require("./mongo.js");
const collection = "tech-blogs";
module.exports = {
  bulkInsert: async function (models) {
    try {
      let result = await (await mongo.getDbConnection())
        .collection(collection)
        .insertMany(models);
      return result;
    } catch (error) {
      console.error(
        `Error while saving record in database for collection ${collection} data: ${JSON.stringify(
          models
        )} ,error:${error}`
      );
      throw error;
    }
  },
  count: async function () {
    try {
      let result = await (await mongo.getDbConnection())
        .collection(collection)
        .countDocuments();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  findOne: async function (model) {
    try {
      let response = await (await mongo.getDbConnection())
        .collection(collection)
        .findOne({ $or: [{ title: model.title }, { link: model.link }] });
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  findByCategoryAndCompany: async function (searchParams) {
    try {
        let query = {topic : searchParams.category};

        if(searchParams.company){
            query = {"$and": [{topic : searchParams.category}, {blog : searchParams.company}]};
        }
        let response = await (await mongo.getDbConnection()).collection(collection).find(query).toArray();
        return response; 
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
