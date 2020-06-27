express = require('express');

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
    flag: Joi.string().required(),
  }),
);
router.post('/', middleware.checkToken, (req, res, next) => {
  const validatedBody = requestSchema.validate(req.body);
  if (validatedBody.error) {
    next(createError(400, 'Invalid Payload'));
    return;
  }
  const {
    name, flag,
  } = validatedBody.value;

  Challenge.findOne({ name }, 'name flag', (err1, chall) => {
    if (chall.flag === flag) {
      req.team.solves.push(chall.name); res.json({
        success: true,
        message: 'Correct Flag',
      });
      req.team.save();
      res.end();
    } else {
      next(createError(403, 'Wrong Flag'));
    }
  });
});

module.exports = router;
