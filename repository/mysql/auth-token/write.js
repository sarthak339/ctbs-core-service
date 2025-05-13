const db = require("../knex");



module.exports = {
    update : async function(userId, refresh_token, access_token){
        try{
            let tokenData = {
                user_id : userId, 
                refresh_token : refresh_token, 
                access_token : access_token
            }
            const authToken = await db("tokens").where({user_id: tokenData.user_id}).update(tokenData); 
            return authToken;
        }catch(error){
            console.error(error);
            throw error;
        }
    }, 
    create : async function(tokenData){
        try{
            const authToken = await db("tokens").insert(tokenData); 
            return authToken;
        }catch(error){
            console.error(error);
            throw error;
        }
    }
}