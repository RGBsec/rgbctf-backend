const crypto = require('crypto');

const genBytes = (amount) => crypto.randomBytes(amount).toString('hex');

const sha512 = function createSaltedSHA512Sum(password, salt) {
  const hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  return hash.digest('hex');
};

module.exports = {
  genBytes,
  sha512,
};
