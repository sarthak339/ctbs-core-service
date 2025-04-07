const repo = require("../../repository");
const utils = require("../../utils");
const config = require("../config");
const Parser = require("rss-parser");
const parser = new Parser();
const cron = require("node-cron");

function extractImage(entry) {
  if (entry.enclosure?.url) return entry.enclosure.url;
  if (entry["media:content"]?.url) return entry["media:content"].url;
  if (entry["media:thumbnail"]?.url) return entry["media:thumbnail"].url;

  // Try extracting first image from HTML content
  const html = entry.content || entry.summary || "";
  const match = html.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : null;
}

async function generateDescription(title, source) {
  try {
    const openAIModel = utils.openAI.model;
    const prompt = `Write a concise 60-word summary for an article titled "${title}" from ${source}.`;
    const result = await openAIModel.generateContent(prompt);
    const response = await result.response;
    const description = response.text().trim().replace(/"/g, ""); // Ensure clean output
    return description;
  } catch (error) {
    console.error("Error generating description:", error);
    return "No description available.";
  }
}

const praseFeed = async function (feeds) {
  const allFeeds = await Promise.all(
    feeds.map(async (feed) => {
      try {
        const parsed = await parser.parseURL(feed.url);

        const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

        const items = await Promise.all(
          parsed.items.map(async (entry) => {
            const pubDate = new Date(
              entry.isoDate || entry.pubDate || Date.now()
            );
            const pubDay = pubDate.toISOString().slice(0, 10);

            if (pubDay !== today) return null; // Skip if not today

            return {
              title: entry.title || "No title",
              description: await generateDescription(entry.title, feed.source),
              time: pubDate.toISOString(),
              author: entry.creator || entry.author || "Unknown",
              link: entry.link || "",
              source: feed.source,
              image: extractImage(entry),
            };
          })
        );

        return items.filter(Boolean); // Remove nulls
      } catch (err) {
        console.error(`Error fetching ${feed.source}:`, err.message);
        return [];
      }
    })
  );

  // Flatten the array and return today's news
  return allFeeds.flat();
};

module.exports = {
  dailyTechNews: async function (req) {
    try {
      const feeds = utils.feed.newsFeed;
      const feedContent = await praseFeed(feeds);
      const latest = feedContent
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 5);
      let count = 0;
      for (const news of latest) {
        const isNewsExist = await repo.mongo.techBlogs.techNews.findByLink(
          news
        );
        if (!isNewsExist) {
          count += 1;
          await repo.mongo.techBlogs.techNews.insert([news]);
        }
      }
      console.log(`${count} news extracted successfully`);
    } catch (err) {
      console.error("Unexpected error:", err.message);
      throw err;
    }
  },
  fetchTechNews: async function (req) {
    try {
      const prompt = config.prompts.fetchTechNewsPrompt;
      const result = await utils.openAI.model.generateContent(prompt);
      const response = result.response;
      const topic = response.text().trim().replace(/"/g, ""); // Ensure clean output
      console.log(topic);
      return {
        result: {
          message: "Successfully fetched tech news",
        },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  schdeuleFetchTechNews: async function () {
    try {
      console.log("intialize cron job for fetching tech News every day");
      cron.schedule("30 9 * * *", async () => {
        console.log("Fetching blogs every day at midnight...");
        await this.dailyTechNews();
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
