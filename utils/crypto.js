const bcrypt = require('bcrypt');

const hashPassword = (password, cost) => bcrypt.hash(password, cost);
const checkPassword = (password, encodedPassword) => bcrypt.compare(password, encodedPassword);

module.exports = {
  hashPassword,
  checkPassword,
};
