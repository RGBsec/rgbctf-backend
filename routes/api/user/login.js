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

router.post('/', async (req, res, next) => {
  const validatedBody = requestSchema.validate(req.body);
  if (validatedBody.error) {
    next(createError(400, 'Invalid Payload'));
    return;
  }
  const { name, email, password } = validatedBody.value;
  let user;
  try {
    if (email == null) {
      user = await User.findOne({ name }, 'hash confirmedEmail admin');
    } else {
      user = await User.findOne({ email }, 'hash confirmedEmail admin');
    }
  } catch (err) {
    debug(`login/user: err: ${err.message}`);
    next(createError(500, 'Internal Error'));
    return;
  }

  if (user === null) {
    next(createError(403, 'Invalid Login'));
    return;
  }

  let success;
  try {
    success = await crypto.checkPassword(password, user.hand);
  } catch (err) {
    debug(`login/user: checkpw: err: ${err.message}`);
    next(createError(500, 'Internal Error'));
    return;
  }

  if (success) {
    req.session.uid = user._id;
    res.apiRes('logged in');
  } else {
    next(createError(403, 'Invalid Login'));
  }
});

module.exports = router;
