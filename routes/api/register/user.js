const express = require('express');
const debug = require('debug')('rgbctf-backend');
const crypto = require('crypto');
const User = require('../../../models/user');

const router = express.Router();


const genSalt = function generateSaltOfSpecifiedLength(length) {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
};

const sha512 = function createSaltedSHA256Sum(password, salt) {
  const hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  const value = hash.digest('hex');
  return {
    salt,
    passwordHash: value,
  };
};


router.post('/', (req, res) => {
  debug(`register/user: ${JSON.stringify(req.body)}`);
  const salt = genSalt(16);
  const hash = sha512(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    hash,
    salt,
  });
  user.save((e) => {
    if (e) {
      debug(`register/user: err: ${e}`);
      res.send({ success: false, err: 'bad data' });
      return;
    }
    res.send({ success: true, msg: 'registered' });
  });
});

module.exports = router;
