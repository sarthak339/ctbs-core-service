const Parser = require("rss-parser");
const fs = require("fs");
const utils = require("../../utils");
const repo = require("../../repository");
const puppeteer = require("puppeteer");
const { JSDOM } = require("jsdom");

const parser = new Parser({
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  },
});

const FILE_NAME = "tech_blogs.json";

const BASE_URL_OF_ADOBLE_BLOGS = "https://blog.adobe.com";

// gemini setup

const { GoogleGenerativeAI } = require("@google/generative-ai");
const API_KEY = process.env.GENERATIVE_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

async function fetchBlogArticles(blog) {
  try {
    console.log(`Fetching articles from: ${blog.name}`);
    const feed = await parser.parseURL(blog.url);
    if (blog.url=="https://huggingface.co/blog/feed.xml"){
      console.log(blog.url);
    }
    return feed.items.slice(0, 3).map((item) => ({
      blog: blog.name,
      title: item.title,
      link:
        blog.name == "Adobe Tech Blog"
          ? BASE_URL_OF_ADOBLE_BLOGS + item.link
          : item.link,
      author: item.creator || "Unknown",
      publishedDate: item.pubDate,
      categories: item.categories ? item.categories.join(", ") : "N/A",
      image: item.enclosure?.url || null,
    }));
  } catch (error) {
    console.error(`❌ Error fetching ${blog.name}:`, error.message);
    return []; // Return empty array on error
  }
}

async function categorizeArticleByCategory(article, allCategory) {
  const prompt = `
      Categorize the following blog into one of these categories: 
      ${allCategory.map((doc) => doc.title.toLowerCase())}.
      If the blog does not fit into any of these categories, suggest the most relevant category name. 
      Return only the category name. Do not explain. 
      
      Blog Title: "${article.title}"  
      Blog Source: "${article.blog}"  
      categories: "${article.categories}"

      if you are unable to categorize the blog,first check the categories i given to you and give based on that .

      Response format: "<Category Name>"
    `;
  // **Add a delay before processing the next article**
  await delay(3000);
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const topic = response.text().trim().replace(/"/g, ""); // Ensure clean output
    console.log(topic);
    const isCategoryExist = allCategory.find(
      (doc) => doc.title.toLowerCase() === topic.toLowerCase()
    );
    if (!isCategoryExist) {
      let response = await repo.mongo.techBlogs.category.bulkInsert([
        { title: topic },
      ]);
      if (response.acknowledged) {
        console.log(`✅ Successfully added new category: ${topic}`);
        allCategory.push({ title: topic });
      }
    }
    article.topic = topic || "Uncategorized";
    console.log(article.topic);
    return article;
  } catch (error) {
    console.error("❌ Error categorizing blog:", error.message);
    article.topic = "Uncategorized";
  }
}

async function articleAlreadyExist(article) {
  try {
    const isArticleExist = await repo.mongo.techBlogs.master.findOne(article);
    return isArticleExist ? true : false;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function categorizeArticles(articles) {
  let newArticles = [];
  let allCategory = await repo.mongo.techBlogs.category.findAll();

  for (const article of articles) {
    if (!(await articleAlreadyExist(article))) {
      let articleWithTopic = await categorizeArticleByCategory(
        article,
        allCategory
      );
      newArticles.push(articleWithTopic);
      if(newArticles.length>=10){
        await repo.mongo.techBlogs.master.bulkInsert(newArticles);
        newArticles = [];
      }
    }
  }
  if (newArticles.length === 0) {
    return;
  }
  console.log(`✅ Updated ${FILE_NAME} with ${articles.length} new articles.`);
  let result = await repo.mongo.techBlogs.master.bulkInsert(newArticles);
  return result;
}

function parseRSS(xmlContent) {
  
  const dom = new JSDOM(xmlContent, { contentType: "text/xml" });
  const document = dom.window.document;

  const items = [...document.querySelectorAll("item")].map((item) => {
    const title = item.querySelector("title")?.textContent?.trim() || "No Title";
    if(title=="Hugging Face - Blog"){
      console.log(title); 
    }
    const link =
      item.querySelector("link")?.textContent?.trim() ||
      item.querySelector("guid")?.textContent?.trim() ||
      item.querySelector("guid")?.getAttribute("isPermaLink") === "true"
        ? item.querySelector("guid")?.textContent?.trim()
        : "#";
  
    return {
      title,
      link,
      creator:
        item.querySelector("dc\\:creator")?.textContent?.trim() || "Unknown",
      pubDate:
        item.querySelector("pubDate")?.textContent?.trim() || "Unknown",
      categories: [...item.querySelectorAll("category")].map((cat) =>
        cat.textContent?.trim()
      ),
      enclosure: {
        url: item.querySelector("enclosure")?.getAttribute("url") || "",
      },
    };
  });
  

  return { items };
}

module.exports = {
  fetchAllTechBlogs: async function (req) {
    try {
      const techBlogs = await repo.mongo.techBlogs.company.findAll();
      const batchSize = 10;
      for (let i = 0; i < techBlogs.length; i += batchSize) {
        const batch = techBlogs.slice(i, i + batchSize);
        console.log(`Processing batch: ${i / batchSize + 1}`);
        const articles = (
          await Promise.all(batch.map(fetchBlogArticles))
        ).flat();
        // Categorize articles and update JSON
        await categorizeArticles(articles);
      }
      console.log("\n✅ Successfully saved latest articles from tech blogs.");
      return {
        status: 200,
        message: "Successfully saved latest articles from tech blogs.",
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  fetchFeed: async function () {
    try {
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  getBlogs: async function (req) {
    try {
      let category = req.query?.category || "AI";
      let company = req.query?.company || "all";
      let searchParams = {
        category: category,
        company: company,
      };
      let result = await repo.mongo.techBlogs.master.findByCategoryAndCompany(
        searchParams
      );
      let blogs = {};
      await result.map((blg) => {
        const blogName = blg.blog;
        blogs[blogName] = blogs[blogName] || [];
        blogs[blogName].push(blg);
      });

      for (const blogName in blogs) {
        blogs[blogName].sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
      }
      blogs = Object.fromEntries(
        Object.entries(blogs).sort((a, b) => b[1].length - a[1].length)
    );
      return blogs;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  fetchOneTechBlogEachTime: async function (req) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const blogs = req.body.feed;
    for (const blog of blogs) {
      try {
        await page.goto(blog.url, { waitUntil: "networkidle2" });

        const rssContent = await page.evaluate(() => document.body.innerText);

        // Check if RSS content is valid XML
        if (!rssContent.includes("<?xml")) {
          throw new Error("Invalid RSS content");
        }

        // Convert RSS XML to JSON
        const parsedData = parseRSS(rssContent);

        // Convert the extracted data into the required format
        const formattedFeed = parsedData.items.map((item) => ({
          blog: blog.name,
          title: item.title,
          link:
            blog.name === "Adobe Tech Blog"
              ? BASE_URL_OF_ADOBLE_BLOGS + item.link
              : item.link,
          author: item.creator || "Unknown",
          publishedDate: item.pubDate,
          categories: item.categories ? item.categories.join(", ") : "N/A",
          image: item.enclosure?.url || null,
        }));

        console.log(`\n🔹 ${blog.name} Articles:`);
        await categorizeArticles(formattedFeed);
        return {
          status: 200,
          message: "Successfully saved latest articles from tech blogs.",
        };
      } catch (error) {
        console.error(`❌ Failed to fetch ${blog.name}:`, error.message);
        throw error;
      }
    }

    await browser.close();
  }
};
