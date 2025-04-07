const service = require("../../services"); 
const validateSchema = require("./feedbackSchema");


module.exports = {
    addFeedback: async function(req, res, next){
        try{
         const validateResult  = validateSchema.FEED_BACK_SCHEMA.validate(req.body);
         if(validateResult.error){
            return res.status(400).json({error:validateResult.error.details[0].message}); 
         }

         let response = await service.feedback.addFeedBack(req);
         return res.status(response.status).json(response);
        }catch(error){
            console.error(error); 
            return res.status(500).json({error:"INTERNAL SERVER ERROR"}); 
        }
    }
}