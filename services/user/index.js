const repo = require('../../repository'); 


module.exports= {
    // login : async function(){
    //     try{

    //     }catch(error){
    //         console.error(error); 
    //         throw error; 
    //     }
    // }
    getUserList : async function(){
        try{
        let userList = repo.mysql.user.getUsers();
        return userList; 
 
        }catch(error){
            console.error(error); 
            throw error; 
        }
    }
}