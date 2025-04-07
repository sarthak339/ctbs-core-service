const service = require('../../services')
const utility = require('../../utils')

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
    getNews : async function(req, res , next){
        try{
            let page = req.query.page || 1; 
            let pageSize = req.query.pageSize || 5; 
            let result  = await service.techNews.getNews(page, pageSize); 
            response = utility.paginated.createPaginatedResponse(result.count, page, pageSize, result.content);
            res.status(200).json(response);
        }catch(error){
            console.error(error); 
            return res.status(500).json({error:"INTERNAL SERVER ERROR"}); 
        }
    }
}
