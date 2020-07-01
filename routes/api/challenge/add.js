const express = require('express');
const debug = require('debug')('rgbctf-backend');
const createError = require('http-errors');
const Joi = require('@hapi/joi');
const Challenge = require('../../../models/challenge');

const router = express.Router();

const requestSchema = Joi.alternatives().try(
  Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
    hints: Joi.array().items(Joi.string()).optional(),
    flagCaseSensitive: Joi.boolean().required(),
    flag: Joi.string().required(),
    points: Joi.number().required(),
  }),
);

router.post('/', (req, res, next) => {
  const validatedBody = requestSchema.validate(req.body);
  if (validatedBody.error) {
    next(createError(400, 'Invalid Payload'));
    return;
  }
  if (!req.user.admin) {
    next(createError(403, 'Unauthorized'));
    return;
  }

  const {
    name, description, points, flagCaseSensitive, category, flag,
  } = validatedBody.value;
  const hints = validatedBody.value.hints || [];

  Challenge.exists({ name }, (err, exists) => {
    if (err) {
      debug(`challenge/add: err: ${err.message}`);
      next(createError(500, 'Internal Error'));
      return;
    }
    if (exists) {
      next(createError(422, 'Challenge Already Exists'));
      return;
    }

    const challenge = new Challenge({
      name, description, hints, flagCaseSensitive, points, category, flag,
    });
    challenge.save((saveE) => {
      if (saveE) {
        debug(`challenge/add: err: ${saveE.message}`);
        next(createError(500, 'Internal Error'));
      }
    });
    res.json({
      success: true,
      message: 'added challenge',
    });
    res.end();
  });
});

module.exports = router;
