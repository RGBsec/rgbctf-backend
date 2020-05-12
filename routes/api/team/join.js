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
  if (req.session.userId === null) {
    res.send({ success: false, err: 'not logged in' });
    res.end();
    return;
  }
  User.findById(req.session.userId, 'teamId', (e, user) => {
    if (e) {
      debug(`join/team: err: ${e}`);
      res.send({ success: false, err: 'internal error' });
      res.end();
      return;
    }
    if (user.teamId === null) {
      res.send({ success: false, err: 'already on team' });
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
    Team.findOne({ name }, 'inviteCode', (teamE, team) => {
      if (teamE) {
        debug(`join/team: err: ${teamE}`);
        res.send({ success: false, err: 'internal error' });
        res.end();
      } else if (team.inviteCode === inviteCode) {
        // eslint-disable-next-line no-underscore-dangle
        Team.findByIdAndUpdate(team._id, {
          $push: {
            members: req.session.userId,
          },
        }, (updateE) => {
          if (updateE) {
            debug(`join/team: err: ${updateE}`);
            res.send({ success: false, err: 'internal error' });
            res.end();
          } else {
            // eslint-disable-next-line no-underscore-dangle
            User.findByIdAndUpdate(req.session.userId, { teamId: team._id }, (userUpdateE) => {
              if (userUpdateE) {
                debug(`join/team: err: ${userUpdateE}`);
                res.send({ success: false, err: 'internal error' });
              } else {
                res.send({ success: true, msg: 'joined team' });
              }
              res.end();
            });
          }
        });
      } else {
        res.send({ success: false, err: 'wrong invite code' });
        res.end();
      }
    });
  });

});

module.exports = router;
