const mongo = require("./mongo");
const collection = "techNews"; 

module.exports = {
  insert : async function(model){
    try{
      let result = await(await mongo.getDbConnection()).collection(collection).insertMany(model); 
      return result; 
    }catch(error){
        console.error(error); 
        throw error; 
    }
  }, 
  findByLink : async function(news){
    try{
        let result = await(await mongo.getDbConnection()).collection(collection).findOne({link:news.link})
        return result; 
      }catch(error){
          console.error(error); 
          throw error; 
      }
  }
};
