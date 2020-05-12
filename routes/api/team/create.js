const express = require('express');
const debug = require('debug')('rgbctf-backend');
const Joi = require('@hapi/joi');
const Team = require('../../../models/team');
const User = require('../../../models/user');

const router = express.Router();

const requestSchema = Joi.object({
  name: Joi.string().required(),
  inviteCode: Joi.string().required(),
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
        members: [req.session.userId],
      });
      team.save((saveE, savedTeam) => {
        if (saveE) {
          debug(`create/team: err: ${saveE}`);
          res.send({ success: false, err: 'internal error' });
          res.end();
          return;
        }
        // eslint-disable-next-line no-underscore-dangle
        User.findByIdAndUpdate(req.session.userId, { teamId: savedTeam._id }, (updateE) => {
          if (updateE) {
            debug(`create/team: err: ${saveE}`);
            res.send({ success: false, err: 'internal error' });
          } else {
            res.send({ success: true, msg: 'team created' });
          }
          res.end();
        });
      });
    }
  });
});

module.exports = router;
