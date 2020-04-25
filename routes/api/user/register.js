const express = require('express');
const debug = require('debug')('rgbctf-backend');
const config = require('../../../config');
const User = require('../../../models/user');
const crypto = require('../../../utils/crypto');

const router = express.Router();


router.post('/api/user/register', (req, res) => {
  debug(`/api/user/register: ${JSON.stringify(req.body)}`);
  const salt = crypto.genBytes(config.saltLength);
  const cookie = crypto.genBytes(config.cookieLength);
  const user = new User({
    name: req.body.name,
    hash: crypto.sha512(req.body.password, salt),
    salt,
    cookie,
  });
  if (user.validateSync()) {
    debug('api/user/register: invalid payload');
    res.send({ success: false, err: 'bad data' });
    res.end();
    return;
  }
  user.save((e) => {
    if (e) {
      debug(`api/user/register: err: ${e}`);
      res.send({ success: false, err: 'internal error' });
      res.end();
      return;
    }
    req.session.secret = cookie;
    res.send({ success: true, msg: 'registered' });
    res.end();
  });
});

module.exports = router;
