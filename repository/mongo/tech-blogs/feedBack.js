
const mongo = require("./mongo.js");
const collection = "feedback";

module.exports = {
    addFeedBack: async function (model) {    
        try{
            let result = await (await mongo.getDbConnection()).collection(collection).insertOne(model); 
            return result;

        } catch(error){
            console.error(`Error while saving record in database for collection ${collection} data: ${JSON.stringify(req.body)} ,error:${error}`);
            throw error;
        }

    }, 
    checkEmailExist : async function (email) {
        try{
            let result = await (await mongo.getDbConnection()).collection(collection).findOne({email : email}); 
            return result; 
        } catch(error){
            console.error(`Error while checking email exist in database for collection ${collection} data: ${JSON.stringify(email)} ,error:${error}`);
            throw error;
        }
    }
}