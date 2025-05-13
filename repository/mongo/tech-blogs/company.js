const { errorMonitor } = require('node-cron/src/scheduled-task.js');
const mongo = require('./mongo.js');
const collection = 'company';

module.exports = {
    bulkInsert: async function (models) {
        try {
            let result = await (await mongo.getDbConnection()).collection(collection).insertMany(models);
            return result;
        }
        catch (error) {
            console.error(`Error while saving record in database for collection ${collection} data: ${JSON.stringify(models)} ,error:${error}`);
            throw error;
        }
    },
    count: async function () {
        try {
            let result = await (await mongo.getDbConnection()).collection(collection).countDocuments();
            return result;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    findAll : async function(){
        try{
            let result = await (await mongo.getDbConnection()).collection(collection).find({}).toArray();
            return result; 
        }catch(error){
            console.error(error);
            throw error;
        }
    }, 
    findOne : async function(model){
        try{
          let result = await (await mongo.getDbConnection()).collection(collection).findOne({ $or: [{ name: model.name },{ url: model.url }]});
          return result; 
        }catch(error){
            console.error(error);
            throw error;
        }
    }, 
    
}