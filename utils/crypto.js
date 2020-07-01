const bcrypt = require('bcrypt');
const crypto = require('crypto');

const hashPassword = (password, cost) => bcrypt.hash(password, cost);
const checkPassword = (password, encodedPassword) => bcrypt.compare(password, encodedPassword);
const secureRandom = (length) => crypto.randomBytes(length).toString('base64').replace(/\//g, '_').replace(/\+/g, '-');

module.exports = {
  hashPassword,
  checkPassword,
  secureRandom,
};
