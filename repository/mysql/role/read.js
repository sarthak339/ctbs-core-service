const db = require("../knex");


module.exports = {
     getRoleByName: async function (roleName) {
        try {
          const role = await db("roles").where({ name: roleName }).first();
          return role['id'];
        } catch (error) {
          console.error(error);
          throw error;
        }
      }, 
      getRoleById : async function(id){
        try{
            const role = await db("roles").where({id: id}).first(); 
            return role;
        }catch(error){
            console.error(error);
            throw error;
        }
      }
}