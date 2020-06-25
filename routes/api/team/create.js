const express = require('express');
const Joi = require('@hapi/joi');
const createError = require('http-errors');
const team = require('../../../utils/team');

const router = express.Router();

// When changing the request schema here, be sure to update it in /routes/api/user/register.js
// and update the associated methods in /utils/team.js
const requestSchema = Joi.object({
  name: Joi.string().required(),
  inviteCode: Joi.string().required(),
});

router.post('/', (req, res, next) => {
  const validatedBody = requestSchema.validate(req.body);
  if (validatedBody.error) {
    next(createError(400, 'Invalid Payload')); return;
  }
  const { name, inviteCode } = validatedBody.value;

  if (req.session.userId == null) {
    next(createError(403, 'Unauthorized')); return;
  }

  // This code was abstracted to /utils/team.js to allow for simpler code
  // when making a team on registration.
  team.register(name, inviteCode, req.session.userId, (response) => {
    res.send(response);
    res.end();
  });
});

module.exports = router;
