const express = require('express');
const debug = require('debug')('rgbctf-backend');
const Joi = require('@hapi/joi');
const User = require('../../../models/user');
const crypto = require('../../../utils/crypto');

const router = express.Router();
const requestSchema = Joi.alternatives().try(
  Joi.object({
    name: Joi.string().required(),
    password: Joi.string().required()
  }),
  Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
  Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
)


router.post('/', (req, res) => {
  const validatedBody = requestSchema.validate(req.body);
  if (validatedBody.error) {
    res.send({ success: false, err: 'invalid payload' });
    res.end();
    return;
  }
  const { name, email, password } = validatedBody.value;
  const handler = (e, user) => {
    if (e) {
      debug(`login/user: err: ${e}`);
      res.send({ success: false, err: 'internal error' });
      res.end();
      return;
    }
    if (user === null) {
      res.send({ success: false, err: 'username or email does not exist' });
      res.end();
      return;
    }
    crypto.checkPassword(password, user.hash).then((success) => {
      if (success) {
        // eslint-disable-next-line no-underscore-dangle
        req.session.userId = user._id;
        res.send({ success: true, msg: 'logged in' });
        res.end();
      } else {
        res.send({ success: false, err: 'wrong password' });
        res.end();
      }
    });
  };
  
  if (email == null) {
    User.findOne({ name }, 'hash salt', handler);
  } else {
    User.findOne({ email }, 'hash salt', handler);
  }
});


module.exports = router;
