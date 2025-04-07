const service = require('../../services')

module.exports = {
    dailyTechNews : async function(req, res ,next){
        try{
            let response = await service.techNews.dailyTechNews(req);
            return res.status(200).json({result:response})
        }catch(error){
            console.error(error);
            return res.status(500).json({error:"INTERNAL SERVER ERROR"});
        }
    }, 
    fetchTechNews : async function(req, res, next){
        try{
           let response = await service.techNews.fetchTechNews(req);
           return res.status(200).json({result:response})
        }catch(error){
            console.error(error); 
            return res.status(500).json({error:"INTERNAL SERVER ERROR"});
        }
    },
}