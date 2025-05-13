const db = require("../knex");




module.exports = {
    createUser : async function(userData){
        try{
            const user = await db("users").insert(userData); 
            return user;
        }catch(error){
            console.error(error);
            throw error;
        }
    }
}