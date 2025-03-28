const express = require("express");
const bodyParser = require("body-parser");
const API_PORT = process.env.PORT || 3002;
const app = express();
const cors = require("cors");
app.use(
  cors({
    origin: process.env.CORS_PERMISSION_SEVER,
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed request methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // Allow cookies and authentication headers
  })
);
const router = express.Router();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(router)
const Controller = require('../controller')


router.get("/api/fetch/blogs", Controller.techBlogs.fetchAllTechBlogs);
router.post("/api/fetch/blog", Controller.techBlogs.fetchOneTechBlogEachTime);
router.get("/api/blogs", Controller.techBlogs.getBlogs);

//company routes 
router.post("/api/company", Controller.company.addCompany);
router.get("/api/company", Controller.company.getcompanyList);

//category routes
router.get("/api/category", Controller.category.getCategoryList);
router.post("/api/category", Controller.category.addCategory);



module.exports = {
    init: async function () {
      app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
    },
  };    
  