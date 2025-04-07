const express = require("express");
const bodyParser = require("body-parser");
const API_PORT = process.env.PORT || 3002;
const app = express();
const cors = require("cors");
app.use(
  cors({
    origin: process.env.CORS_PERMISSION_SEVER,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
const router = express.Router();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(router)
const Controller = require('../controller')


router.get("/api/fetch/blogs", Controller.techBlogs.fetchAllTechBlogs);

// each time blog fetch 
router.post("/api/fetch/blog", Controller.techBlogs.fetchOneTechBlogEachTime);
router.get("/api/blogs", Controller.techBlogs.getBlogs);

//company routes 
router.post("/api/company", Controller.company.addCompany);
router.get("/api/company", Controller.company.getcompanyList);


//category routes
router.get("/api/category", Controller.category.getCategoryList);
router.post("/api/category", Controller.category.addCategory);


//daily tech news 
// router.get('/api/daily/tech', Controller.techNews.dailyTechNews); 
// router.post("/api/add/tech/feed/url", Controller.techNews.addFeedUrl); 
// router.get("/api/fetch/tech/news", Controller.techNews.fetchTechNews);
router.get("/api/daily/news", Controller.techNews.getNews)


router.post("/api/feedback", Controller.feedback.addFeedback);



module.exports = {
    init: async function () {
      app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
    },
  };    
  