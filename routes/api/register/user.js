const express = require('express');
const debug = require('debug')('rgbctf-backend');
const crypto = require('crypto');
const User = require('../../../models/user');

const router = express.Router();
const hasher = crypto.createHash('md5');

router.post('/', (req, res) => {
  debug(`register/user: ${JSON.stringify(req.body)}`);
  hasher.update(req.body.password);
  const hash = hasher.digest('hex');
  const user = new User({
    name: req.body.name,
    hash,
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
