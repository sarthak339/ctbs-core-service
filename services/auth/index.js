const repo = require("../../repository");
const userRoleName = "user";
const encryptPassword = require("../../utils/encryptPassword");
const Bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

const isEmailUserExist = async (email) => {
  try {
    let user = await repo.mysql.user.read.getUserByEmail(email);
    if (user) return true;
    return false;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const generateToken = async (user, tokenId) => {
    try {
      const payload = {
        sub: user.id,
        claims: {
          email : user.email, 
          role : user.roleName, 
          name : user.name
        },
      };
      const accessToken = JWT.sign(payload, process.env.JWT_SECRET_ACCESS_TOKEN, {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
      });
      const refreshToken = JWT.sign(
        payload,
        process.env.JWT_SECRET_REFRESH_TOKEN,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      const userToken = await repo.mysql.authToken.read.findByUserID(user.id);
      if (userToken)
        await repo.mysql.authToken.write.update(user.id, refreshToken, accessToken);
      else {
        const authModel = {
          user_id: user.id,
          access_token: accessToken,
          refresh_token: refreshToken,
        };
        await repo.mysql.authToken.write.create(authModel);
      }
  
      return [accessToken, refreshToken];
    } catch (error) {
      throw error;
    }
  };

module.exports = {
  signup: async function (req) {
    try {
      if (await isEmailUserExist(req.body.email)) {
        let result = {
          email: req.body.email,
          message: "User already exist with this email!!",
          status: 403,
        };
        return result;
      }
      let userData = {
        name: req.body.name,
        email: req.body.email,
        password: await encryptPassword.generateHashPassword(req.body.password),
      };
      let userRoleId = await repo.mysql.role.read.getRoleByName(userRoleName);
      if (!userRoleId) {
        userRoleId = await repo.mysql.role.write.createRole({
          name: userRoleName,
        });
      }
      userData["role_id"] = userRoleId;
      let user = await repo.mysql.user.write.createUser(userData);
      if (!user[0])
        throw new Error("something went wrong, Please try again later!!");
      let result = {
        email: req.body.email,
        message: "User created successfully!!",
        status: 200,
      };
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  login: async function (loginRequest) {
    try {
      let tokenModel = null;
      let user = null;
      let userInfo = await repo.mysql.user.read.getUserByEmail(
        loginRequest.email
      );
      if (!userInfo) return null;

      if (await Bcrypt.compare(loginRequest.password, userInfo.password)) {
        const roleName  = await repo.mysql.role.read.getRoleById(userInfo.role_id);
        delete userInfo.rold_id; 
        userInfo.roleName = roleName.name;
        const [accessToken, refreshToken] = await generateToken(userInfo);
        tokenModel = {
          emailId: userInfo.email,
          name: userInfo.name,
          tokens: {
            accessToken: accessToken,
            refreshToken: refreshToken,
          },
        };
      }
      return tokenModel;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
