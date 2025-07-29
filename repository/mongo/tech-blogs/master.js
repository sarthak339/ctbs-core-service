let mongo = require("./mongo.js");
const collection = "tech-blogs";

const TEXT_INDEX_FIELDS = {
  blog: "text",
  title: "text",
  link: "text",
  author: "text",
  topic: "text",
};

const TEXT_INDEX_NAME = "TextSearchIndex";

async function ensureTextIndex() {
  try {
    const existingIndexes = await (await mongo.getDbConnection())
      .collection(collection)
      .indexes();

    const indexExists = existingIndexes.some(
      (idx) => idx.name === TEXT_INDEX_NAME
    );

    if (!indexExists) {
      await (await mongo.getDbConnection())
        .collection(collection)
        .createIndex(TEXT_INDEX_FIELDS, {
          name: TEXT_INDEX_NAME,
          default_language: "english",
          background: true,
        });
      console.log(`✅ Created text index: ${TEXT_INDEX_NAME}`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

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
      let query = {
        topic: { $regex: new RegExp(`^${searchParams.category}$`, "i") },
      };

      if (searchParams.company.toLowerCase() != "all") {
        query = {
          $and: [
            {
              topic: { $regex: new RegExp(`^${searchParams.category}$`, "i") },
            },
            { blog: { $regex: new RegExp(`^${searchParams.company}$`, "i") } },
          ],
        };
      }

      let response = await (
        await mongo.getDbConnection()
      )
        .collection(collection)
        .find(query, {
          projection: {
            _id: 0, // Exclude the MongoDB ObjectId
          },
        })
        .toArray();
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  findByCategory: async function (category) {
    try {
      let query = { topic: { $regex: new RegExp(`^${category}$`, "i") } };
      let response = await (await mongo.getDbConnection())
        .collection(collection)
        .distinct("blog", query);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  searchInALLFields: async function (searchText) {
    try {
      const db = await mongo.getDbConnection();
      const col = db.collection(collection);

      // Fallback: empty string should not run search
      if (!searchText || searchText.trim().length === 0) {
        return [];
      }

      let response;

      // Use $text search for full keywords (faster)
      if (searchText.length >= 3) {
        await ensureTextIndex(); // only needed for $text
        response = await col
          .find(
            { $text: { $search: searchText } },
            {
              projection: {
                _id: 0,
                score: { $meta: "textScore" },
              },
            }
          )
          .sort({ score: { $meta: "textScore" } })
          .limit(10)
          .toArray();
      } else {
        // Use regex search for short/partial terms
        const regex = new RegExp(searchText, "i");

        response = await col
          .find(
            {
              $or: [
                { title: { $regex: regex } },
                { author: { $regex: regex } },
                { blog: { $regex: regex } },
                { link: { $regex: regex } },
                { topic: { $regex: regex } },
              ],
            },
            {
              projection: {
                _id: 0,
              },
            }
          )
          .limit(10)
          .toArray();
      }

      return response;
    } catch (error) {
      console.error("Search error:", error);
      throw error;
    }
  },
};
