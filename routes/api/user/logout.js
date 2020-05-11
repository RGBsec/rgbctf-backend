const express = require('express');
const debug = require('debug')('rgbctf-backend');
const User = require('../../../models/user');

const router = express.Router();

router.post('/', (req, res) => {
  User.findOneAndUpdate({ cookie: req.session.secret }, { cookie: null }, (e, user) => {
    if (e) {
      debug(`logout/user: err: ${e}`);
      res.send({ success: false, err: 'internal error' });
      res.end();
      return;
    }
    if (user === null) {
      res.send({ success: false, err: 'bad session' });
    } else {
      req.session.secret = null;
      res.send({ success: true, msg: 'logged out' });
    }
    res.end();
  });
});

module.exports = router;
