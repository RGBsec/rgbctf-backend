const express = require('express');
const debug = require('debug')('rgbctf-backend');
const Joi = require('@hapi/joi');
const Team = require('../../../models/team');

const router = express.Router();

const requestSchema = Joi.object({
  name: Joi.string(),
  inviteCode: Joi.string(),
});

router.post('/', (req, res) => {
  const validatedBody = requestSchema.validate(req.body);
  if (validatedBody.error) {
    res.send({ success: false, err: 'invalid payload' });
    res.end();
    return;
  }
  const { name, inviteCode } = validatedBody.value;
  Team.exists({ name }, (e, exists) => {
    if (e) {
      debug(`create/team: err: ${e}`);
      res.send({ success: false, err: 'internal error' });
      res.end();
      return;
    }
    if (exists) {
      res.send({ success: false, err: 'team name exists' });
      res.end();
    } else {
      const team = new Team({
        name,
        inviteCode,
      });
      team.save((saveE) => {
        if (saveE) {
          debug(`create/team: err: ${saveE}`);
          res.send({ success: false, err: 'internal error' });
          res.end();
          return;
        }
        res.send({ success: true, msg: 'team created' });
        res.end();
      });
    }
  });
});

module.exports = router;
