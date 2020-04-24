const express = require('express');
const debug = require('debug')('rgbctf-backend');
const crypto = require('crypto');
const config = require('../../../config');
const User = require('../../../models/user');

const router = express.Router();


const genSalt = () => crypto.randomBytes(config.saltLength).toString('hex');

const sha512 = function createSaltedSHA512Sum(password, salt) {
  const hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  return hash.digest('hex');
};


router.post('/', (req, res) => {
  debug(`register/user: ${JSON.stringify(req.body)}`);
  const salt = genSalt();
  const user = new User({
    name: req.body.name,
    hash: sha512(req.body.password, salt),
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
