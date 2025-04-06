const services = require('../../services');
module.exports = {
    fetchAllTechBlogs : async function(req, res) {
       try{ 
        let response = await services.techBlogs.fetchAllTechBlogs(req);
           return res.status(response.status).json({message:response.message})
       }catch(error){
           return res.status(500).json({error:"INTERNAL SERVER ERROR"})
       }
    },
    getBlogs : async function(req, res, next){
        try{
            let response = await services.techBlogs.getBlogs(req); 
            if(response && Object.keys(response).length>0){
                return res.status(200).json({result:response})
            }
            return res.status(204).json({error:"No Blogs found"})
          
        }catch(error){
            console.error(error); 
            return res.status(500).json({error:"INTERNAL SERVER ERROR"}); 
        }
    }, 
    fetchOneTechBlogEachTime : async function(req, res, next){ 
        try{
            let response = await services.techBlogs.fetchOneTechBlogEachTime(req); 
            return res.status(200).json({result:response})
        } catch(error){
            console.error(error); 
            return res.status(500).json({error:"INTERNAL SERVER ERROR"}); 
        }
    }, 
   
}