const services = require("../../services");
const validateSchema = require("./userSchema");

module.exports = {
  signup: async (req, res) => {
    try {
      // const { name, email, password } = req.body;
      
      const validateResult = validateSchema.USER_SIGN_UP_SCHEMA.validate(req.body);
      if (validateResult.error) {
        return res
          .status(400)
          .json({ error: validateResult.error.details[0].message });
      }
    //   const result = await services.user.signup(req);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ Error : "INTERNAL SERVER ERROR" });
    }
  },

  login: async (req, res) => {
    try {
      // const { email, password } = req.body;
      // const result = await services.user.login(email, password);
      return res.status(200).json(result);
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
};
