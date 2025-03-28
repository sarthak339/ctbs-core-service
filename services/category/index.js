const repo = require("../../repository");

module.exports = {
  addCategory: async function (req) {
    try {
      let response = {
        status: 200,
        message: "category added successfully",
      };
      let categoryList = req.body.categoryList;
      if (!categoryList || categoryList.length === 0) {
        response.status = 400;
        response.message = "Category list can not be empty";
        return response;
      }
      let updatedCategoryList = [];
      for (let category of categoryList) {
        if (!category.title) {
          response.status = 400;
          response.message = `${category.title} is required`;
          return response;
        }
        let isCategoryExist = await repo.mongo.techBlogs.category.findOne(
          category
        );
        if (!isCategoryExist) {
          updatedCategoryList.push({
            title: category.title,
          });
        }
      }

      if (updatedCategoryList.length == 0) {
        return response;
      }
      const category = await repo.mongo.techBlogs.category.bulkInsert(
        updatedCategoryList
      );
      if (category.acknowledged) {
        return response;
      }
      throw new Error(
        "something went wrong !! not able to add category. please try again later"
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  getCategoryList: async function () {
    try {
        let categoryList = await repo.mongo.techBlogs.category.findAll();
        categoryList  = categoryList.map(doc => doc.title)
        return categoryList;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
