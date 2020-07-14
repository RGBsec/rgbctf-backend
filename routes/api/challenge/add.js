const express = require('express');
const debug = require('debug')('rgbctf-backend');
const createError = require('http-errors');
const Joi = require('@hapi/joi');
const Challenge = require('../../../models/challenge');

const router = express.Router();

const requestSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.string().required(),
  hints: Joi.array().items(Joi.string()).optional(),
  flagCaseSensitive: Joi.boolean().required(),
  flag: Joi.string().required(),
  points: Joi.number().required(),
});

router.post('/', async (req, res, next) => {
  const validatedBody = requestSchema.validate(req.body);
  if (validatedBody.error) {
    next(createError(400, 'Invalid Payload'));
    return;
  }
  if (!req.user.admin) {
    next(createError(403, 'Unauthorized'));
    return;
  }

  const { name } = validatedBody.value;
  const hints = validatedBody.value.hints || [];

  try {
    const exists = Challenge.exists({ name });
    if (exists) {
      next(createError(422, 'Challenge Already Exists'));
      return;
    }
  } catch (err) {
    debug(`challenge/add: err: ${err.message}`);
    next(createError(500, 'Internal Error'));
    return;
  }

  const challenge = new Challenge({ ...validatedBody.value, hints });
  try {
    challenge.save();
  } catch (err) {
    debug(`challenge/add: err: ${err.message}`);
    next(createError(500, 'Internal Error'));
  }

  res.apiRes('added challenge');
});

module.exports = router;
