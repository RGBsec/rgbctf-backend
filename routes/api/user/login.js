const express = require('express');
const debug = require('debug')('rgbctf-backend');
const Joi = require('@hapi/joi');
const User = require('../../../models/user');
const crypto = require('../../../utils/crypto');
const config = require('../../../config');

const router = express.Router();
const requestSchema = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().required(),
});


router.post('/', (req, res) => {
  const validatedBody = requestSchema.validate(req.body);
  if (validatedBody.error) {
    res.send({ success: false, err: 'invalid payload' });
    res.end();
    return;
  }
  const { name, password } = validatedBody.value;
  User.findOne({ name }, 'hash salt', (e, user) => {
    if (e) {
      debug(`login/user: err: ${e}`);
      res.send({ success: false, err: 'internal error' });
      res.end();
      return;
    }
    if (user === null) {
      res.send({ success: false, err: 'username does not exist' });
      res.end();
    } else if (crypto.sha512(password, user.salt) === user.hash) {
      const cookie = crypto.genBytes(config.cookieLength);
      // eslint-disable-next-line no-underscore-dangle
      User.findByIdAndUpdate(user._id, { cookie }, () => {
        req.session.secret = cookie;
        res.send({ success: true, msg: 'logged in' });
        res.end();
      });
    } else {
      res.send({ success: false, err: 'wrong password' });
      res.end();
    }
  });
});

module.exports = router;
