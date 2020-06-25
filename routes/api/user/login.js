const express = require('express');
const debug = require('debug')('rgbctf-backend');
const Joi = require('@hapi/joi');
const createError = require('http-errors');
const User = require('../../../models/user');
const crypto = require('../../../utils/crypto');

const router = express.Router();

const requestSchema = Joi.alternatives().try(
  Joi.object({
    name: Joi.string().required(),
    password: Joi.string().required(),
  }),
  Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
);

router.post('/', (req, res, next) => {
  const validatedBody = requestSchema.validate(req.body);
  if (validatedBody.error) {
    next(createError(400, 'Invalid Payload'));
    return;
  }
  const { name, email, password } = validatedBody.value;
  const handler = (e, user) => {
    if (e) {
      debug(`login/user: err: ${e}`);
      next(createError(500, 'Internal Error'));
      return;
    }
    if (user === null) {
      next(createError(403, 'Invalid Login'));
      return;
    }
    crypto.checkPassword(password, user.hash).then((success) => {
      if (success) {
        // eslint-disable-next-line no-underscore-dangle
        req.session.userId = user._id;
        res.send({ success: true, msg: 'logged in' });
        res.end();
      } else {
        next(createError(403, 'Invalid Login'));
      }
    });
  };
  if (email == null) {
    User.findOne({ name }, 'hash', handler);
  } else {
    User.findOne({ email }, 'hash', handler);
  }
});

module.exports = router;
