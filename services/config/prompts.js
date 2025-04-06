const CONSTANT = require("./constant");

module.exports = {
  fetchTechNewsPrompt: `Extract the latest daily news (from the past 24 hours) focused exclusively on major tech companies (e.g., Google, Microsoft, Apple, Amazon, Meta, Nvidia, OpenAI) and key developer-centric domains:
- Software development (frontend/backend/frameworks/tools)
- Artificial Intelligence & Machine Learning
- DevOps & Cloud (AWS, Azure, GCP, infrastructure)
- Programming languages and developer platforms
- Major product releases, acquisitions, or policy changes by Big Tech
Only use articles from reputable tech journalism sites like:
${CONSTANT.TECH_NEWS_SOURCES.join(", ")}
Strictly exclude:
- Company blogs or press releases
- Sponsored or promotional content
- Unverified or opinion pieces

Return the results in the following strict JSON format (limit to top 10):
${JSON.stringify(CONSTANT.NEWS_EXTRACT_SCHEMA)}`,
};
