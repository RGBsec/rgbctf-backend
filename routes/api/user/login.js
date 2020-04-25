const express = require('express');
const debug = require('debug')('rgbctf-backend');
const User = require('../../models/user');

const router = express.Router();

router.post('/', (req, res) => {
  // debug(`register/user: ${JSON.stringify(req.body)}`);
  // if (typeof req.body.name === String || typeof res.name !== String)
  // User.find({ name: req.name }, (err, user) => {
  //   if (err) {
  //     debug(`register/user err: ${err}`);
  //     res.send({ success: false, err: 'bad data' });
  //     return;
  //   }
  //   user.
  // });
});

module.exports = router;
