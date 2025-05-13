const services = require('../../services')
module.exports = {
    addCompany : async function(req, res) {
       try{ 
        let response = await services.company.addCompany(req);
           return res.status(200).json({result:response})
       }catch(error){
           return res.status(500).json({error:"INTERNAL SERVER ERROR"})
       }
    }, 
    getcompanyList : async function(req, res, next){
        try{
           let response = await services.company.getcompanyList(req);
           return res.status(200).json({result:response})
        }catch(error){
            console.error(error); 
            return res.status(500).json({error:"INTERNAL SERVER ERROR"});
        }
    }, 
    getCompanyListV2 : async function(req, res, next){
        try{
           let response = await services.company.getCompanyListV2(req);
           return res.status(200).json({result:response})
        }catch(error){
            console.error(error); 
            return res.status(500).json({error:"INTERNAL SERVER ERROR"});
        }
    }
}