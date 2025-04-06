module.exports = {
    TECH_NEWS_SOURCES: [
    "TechCrunch",
    "The Verge",
    "Wired",
    "Ars Technica",
    "ZDNet",
    "TechRadar",
    "Engadget",
    "CNBC Tech",
    "Bloomberg Technology",
    "InfoWorld",
    "VentureBeat",
    "Stack Overflow Blog",
    "GitHub Blog",
    "Hacker News (front page only)",
    "RedMonk",
    "The New Stack",
    "Protocol",
    "IEEE Spectrum",
    "Smashing Magazine",
    "MakeUseOf (MUO)",
    "Dev.to",
    "DZone"
  ], 
  NEWS_EXTRACT_SCHEMA : {
    result: [
        {
          title: "Title of the article",
          description: "Brief summary of the article",
          time: "Published date and time in ISO 8601 format",
          author: "Author name or 'Unknown'",
          link: "Direct link to the article",
          source: "Tech news site name"
        }
      ]
  }
  
}