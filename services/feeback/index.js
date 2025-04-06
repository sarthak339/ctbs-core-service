const repo = require("../../repository");

module.exports = {
  addFeedBack: async function (req) {
    try {
        let feedBackFormData = req.body; 
        feedBackFormData.createdAt = new Date().toISOString();
        let response  = await repo.mongo.techBlogs.feedback.addFeedBack(feedBackFormData); 
        if(response.acknowledged){
            return {
                status : 200, 
                message : "Feedback submitted successfully"
            }
        }
        throw Error("something went wrong !! not able to add feedback. please try again later");
    } catch (error) {
      console.error(error);
      throw error;
    } 
  },
};
