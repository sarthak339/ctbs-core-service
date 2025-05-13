const services = require("../../services");
const validateSchema = require("./authSchema");

module.exports = {
  signup: async (req, res) => {
    try {
      const validateResult = validateSchema.USER_SIGN_UP_SCHEMA.validate(
        req.body
      );
      if (validateResult.error) {
        return res
          .status(400)
          .json({ error: validateResult.error.details[0].message });
      }
      const result = await services.auth.signup(req);
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(500).json({ Error: "INTERNAL SERVER ERROR" });
    }
  },

  login: async (req, res) => {
    try {
      const validateResult = validateSchema.USER_LOGIN_SCHEMA.validate(
        req.body
      );
      if (validateResult.error) {
        return res
          .status(400)
          .json({ error: validateResult.error.details[0].message });
      }
      const tokenModel = await services.auth.login(req.body);
      if (tokenModel == null)
        return res.status(401).json({
          timestamp: new Date(),
          status: 401,
          error: "Unauthorized",
          trace: "",
          message: "Email or Password Invalid",
        });
      let response = {
        success: true,
        message: "User login succcessfuly",
        ...tokenModel,
      };
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ Error: "INTERNAL SERVER ERROR" });
    }
  },
  getUserList: async function () {
    try {
      let userList = await services.user.getUserList();
      return res.status(200).json({ resut: userList });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  googleAuthCallback : async (req, res)=>{
    try{
       return res.status(200).json({ success: true, message: "User login succcessfuly", ...req.user });
    }catch(error){
      console.error(error);
      return res.status(500).json({ Error: "INTERNAL SERVER ERROR" });
    }
  }

};
