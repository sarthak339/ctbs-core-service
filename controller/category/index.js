
const services = require('../../services');

module.exports = {
    addCategory : async (req, res) => {     
        try{
            let response = await services.category.addCategory(req);
            return res.status(response.status).json({result:response});
        }catch(error){
           console.error(error); 
           return res.status(500).json({error:"INTERNAL SERVER ERROR"});
        }

    }, 
    getCategoryList : async (req, res) => {
        try{
         let response = await services.category.getCategoryList(req);
            return res.status(200).json({result:response});
        }catch(error){
            console.error(error);
            return res.status(500).json({error:"INTERNAL SERVER ERROR"});
        }
    }
}