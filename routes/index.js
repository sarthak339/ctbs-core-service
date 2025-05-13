const express = require("express");
const bodyParser = require("body-parser");
const API_PORT = process.env.PORT || 3002;
const app = express();
const middleware = require("../middleware");
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



const Controller = require('../controller');



  


//signup and login routes 

// router.post("/api/auth/signup", Controller.auth.signup); 
// router.post("/api/auth/login", Controller.auth.login);

// gogl auth routes 
// router.get("/api/auth/google",middleware.googleAuth);
// router.get("/auth/google/callback", middleware.googleAuth, Controller.auth.googleAuthCallback);


// fetch blogs 
router.get("/api/fetch/blogs", Controller.techBlogs.fetchAllTechBlogs);

// each time blog fetch 
router.post("/api/fetch/blog", Controller.techBlogs.fetchOneTechBlogEachTime);
router.get("/api/blogs", Controller.techBlogs.getBlogs);

//company routes 
router.post("/api/company", Controller.company.addCompany);
router.get("/api/company", Controller.company.getcompanyList);
router.get("/api/company/v2", Controller.company.getCompanyListV2);


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
  