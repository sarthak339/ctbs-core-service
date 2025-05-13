const bcrypt = require('bcrypt');

async function generateHashPassword(password) {
  const saltRounds = 10;
  const hashed = await bcrypt.hash(password, saltRounds);
  return hashed;
}


module.exports = {
    generateHashPassword: generateHashPassword,
}