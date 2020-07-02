const express = require('express');
const debug = require('debug')('rgbctf-backend');
const createError = require('http-errors');

const router = express.Router();

router.post('/', (req, res, next) => {
  // Send a success either way so people can't brute tokens
  if (!req.session.uid) {
    res.json({ success: true, msg: 'logged out' });
    res.end();
  } else {
    req.revoke((err) => {
      if (err) {
        debug(`user/logout: err: ${err.message}`);
        next(createError(500, 'Internal Error'));
        return;
      }
      res.json({ success: true, msg: 'logged out' });
      res.end();
    });
  }
});

module.exports = router;
