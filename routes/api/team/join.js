const express = require('express');
const Joi = require('@hapi/joi');
const team = require('../../../utils/team');

const router = express.Router();

const requestSchema = Joi.object({
  name: Joi.string().required(),
  inviteCode: Joi.string().required(),
});

router.post('/', (req, res) => {
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
  team.join(name, inviteCode, req.session.userId, (response) => {
    res.send(response);
    res.end();
  });
});

module.exports = router;
