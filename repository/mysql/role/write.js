const db = require("../knex");

module.exports = {
    createRole : async function(roleData){
        try{
            const role = await db("roles").insert(roleData).returning("*");
            return role[0]; 
        }catch(error){
            console.error(error); 
            throw error; 
        }
      }
}