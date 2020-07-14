const express = require('express');
const debug = require('debug')('rgbctf-backend');
const createError = require('http-errors');
const { promisify } = require('util');

const router = express.Router();

router.post('/', async (req, res, next) => {
  // Send a success either way so people can't brute tokens
  if (!req.session.uid) {
    res.apiRes('logged out');
  } else {
    try {
      await promisify(req.revoke)();
    } catch (err) {
      debug(`user/logout: err: ${err.message}`);
      next(createError(500, 'Internal Error'));
      return;
    }
    res.apiRes('logged out');
  }
});

module.exports = router;
