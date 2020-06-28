const express = require('express');

const createError = require('http-errors');
const { valid } = require('@hapi/joi');
const Joi = require('@hapi/joi');
const Team = require('../../models/team');
const Challenge = require('../../models/challenge');

const middleware = require('../../utils/middleware');

const router = express.Router();

const requestSchema = Joi.alternatives().try(
  Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    hints: Joi.array().required(),
    points: Joi.number(),
  }),
);
router.post('/', middleware.checkToken, (req, res, next) => {
  const validatedBody = requestSchema.validate(req.body);
  if (validatedBody.error) {
    next(createError(400, 'Invalid Payload'));
    return;
  } if (!req.user.admin) {
    next(createError(403, 'Unauthorized'));
    return;
  }
  const {
    name, description, hints, flagCaseSensitive, points,
  } = validatedBody.value;

  console.log(validatedBody);
  const challenge = new Challenge({
    name, description, hints, flagCaseSensitive, points,
  });
  challenge.save();
  res.json({
    success: true,
    message: 'Added challenge',
  });
  res.end();
});

module.exports = router;
