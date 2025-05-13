const db  = require('../knex');



module.exports = {
    findByUserID : async function(userId){
        try{
            const authToken = await db("tokens").where({user_id: userId}).first(); 
            return authToken;
        }catch(error){
            console.error(error);
            throw error;
        }
    }
}