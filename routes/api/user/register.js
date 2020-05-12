const express = require('express');
const debug = require('debug')('rgbctf-backend');
const Joi = require('@hapi/joi');
const config = require('../../../config');
const User = require('../../../models/user');
const crypto = require('../../../utils/crypto');

const router = express.Router();


const requestSchema = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().required(),
});

router.post('/', (req, res) => {
  const validatedBody = requestSchema.validate(req.body);
  if (validatedBody.error) {
    debug(`register/user: invalid payload: ${JSON.stringify(req.body)}`);
    res.send({ sucess: false, err: 'invalid payload' });
    res.end();
  }
  const { name, password } = validatedBody.value;
  User.exists({ name }, (e, exists) => {
    if (e) {
      debug(`register/user: err: ${e}`);
      res.send({ success: false, err: 'internal error' });
      res.end();
      return;
    }
    if (exists) {
      res.send({ success: false, err: 'username exists' });
      res.end();
    } else {
      const salt = crypto.genBytes(config.saltLength);
      const cookie = crypto.genBytes(config.cookieLength);
      const user = new User({
        name,
        hash: crypto.sha512(password, salt),
        salt,
        cookie,
      });
      user.save((saveE) => {
        if (saveE) {
          debug(`register/user: err: ${saveE}`);
          res.send({ success: false, err: 'internal error' });
          res.end();
          return;
        }
        req.session.secret = cookie;
        res.send({ success: true, msg: 'registered' });
        res.end();
      });
    }
  });
});

module.exports = router;
