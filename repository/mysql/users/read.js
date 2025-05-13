const db = require("../knex");


module.exports = {
    getUserByEmail : async function(email){
        try{
            const user = await db("users").where({email: email}).first(); 
            return user;
        }catch(error){
            console.error(error);
            throw error;
        }
    }
}