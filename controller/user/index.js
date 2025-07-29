const services = require("../../services");

module.exports = {
  addSubscriber: async function (req, res) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      const result = await services.user.addSubscriber(email);
      if (result.success === false) {
        return res.status(400).json({ message: result.message });
      }
      return res
        .status(201)
        .json({ message: "Subscription successful", data: result });
    } catch (error) {
      console.error("Error adding subscriber:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};
