require("dotenv").config();

global.__basedir = __dirname;

async function init() {
  try {
    await require("./routes").init();
    await require("./services/techBlogs").scheduleFetchBlogs();
    await require("./services/techNews").schdeuleFetchTechNews()
    // require('./services/techNews').dailyTechNews(); 
    // await require('./services/techBlogs').fetchAllTechBlogs(); 
  } catch (error) {
    console.error(`failed to start the server , error: ${error}`);
  }
}

init();
