const repo = require("../../repository");

module.exports = {
  addCompany: async (req) => {
    try {
      let response = {
        status: 200,
        message: "Companies added successfully",
      };
      const companyList = req.body.companyList;
      if (!companyList || companyList.length === 0) {
        response.status = 400;
        response.message = "Company list can not be empty";
        return response;
      }
      const updatedCompanyList = [];
      for (let company of companyList) {
        if (!company.name) {
          response.status = 400;
          response.message = `${company.name} is required`;
          return response;
        }

        if (!company.url) {
          response.status = 400;
          response.message = `${company.url} is required`;
          return response;
        }

        let isCompanyExist = await repo.mongo.techBlogs.company.findOne(
          company
        );
        if (!isCompanyExist) {
          updatedCompanyList.push({
            name: company.name,
            url: company.url,
          });
        }
      }
      if (updatedCompanyList.length == 0) {
        return response;
      }
      const company = await repo.mongo.techBlogs.company.bulkInsert(
        updatedCompanyList
      );
      if (company.acknowledged) {
        return response;
      }
      throw Error(
        "something went wrong !! not able to add company. please try again later"
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  getcompanyList: async function (req) {
    try {
      let category =
        req.query?.category && req.query.category.toLowerCase() != "all"
          ? req.query.category.toLowerCase()
          : "ai";

      if (category != "") {
        var companyList = await repo.mongo.techBlogs.master.findByCategory(
          category
        );
        if (companyList.length > 1) companyList.unshift("ALL");
      } else {
        var companyList = await repo.mongo.techBlogs.company.findAll(category);
        companyList = companyList.map((company) => company.name);
      }
      return companyList;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  getCompanyListV2: async function (req) {
    try {
      const categoryList = await repo.mongo.techBlogs.category.findAll();
      let   companyLists = [];
      for (const category of categoryList) {
        const companies = await repo.mongo.techBlogs.master.findByCategory(category.title); 
        companyLists.push({ [category.title]: companies });
      }
  
      let result = Object.assign({}, ...companyLists);
      return result;

    return result;
  } catch (error) {
      console.error(error);
      throw error;
  }
  },
};
