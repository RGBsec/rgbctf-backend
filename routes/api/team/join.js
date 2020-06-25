const express = require('express');
const Joi = require('@hapi/joi');
const team = require('../../../utils/team');

const router = express.Router();

// When changing the request schema here, be sure to update it in /routes/api/user/register.js
// and update the associated methods in /utils/team.js
const requestSchema = Joi.object({
  name: Joi.string().required(),
  inviteCode: Joi.string().required(),
});

router.post('/', (req, res, next) => {
  if (req.session.userId === null) {
    res.send({ success: false, err: 'not logged in' });
    res.end();
    return;
  }
  const validatedBody = requestSchema.validate(req.body);
  if (validatedBody.error) {
    res.send({ success: false, err: 'invalid payload' });
    res.end();
    return;
  }
  const { name, inviteCode } = validatedBody.value;

  // This code was abstracted to /utils/team.js to allow for simpler code
  // when joining a team on registration.
  team.join(name, inviteCode, req.session.userId, next, (response) => {
    res.send(response);
    res.end();
  });
});

module.exports = router;
