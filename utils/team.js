const debug = require('debug')('rgbctf-backend');
const createError = require('http-errors');
const Team = require('../models/team');
const User = require('../models/user');

// Register a team, with the user ID as the first user.
const register = (name, inviteCode, userId, next, callback) => {
  Team.exists({ name }).then((exists) => {
    if (exists) {
      next(createError(422, 'Team Exists'));
    } else {
      const team = new Team({
        name,
        inviteCode,
        members: [userId],
        points: 0,
        solves: [],
      });
      team.save((saveE, savedTeam) => {
        if (saveE) {
          debug(`create/team: err: ${saveE}`);
          next(createError(500, 'Internal Error')); return;
        }
        User.findByIdAndUpdate(userId, { teamId: savedTeam._id }, (updateE) => {
          if (updateE) {
            debug(`create/team: err: ${saveE}`);
            next(createError(500, 'Internal Error'));
          } else {
            callback({ success: true, msg: 'team created' });
          }
        });
      });
    }
  }).catch((e) => {
    debug(`create/team: err: ${e}`);
    next(createError(500, 'Internal Error'));
  });
};

// Join a team, with the user ID being the user to add.
const join = (name, inviteCode, userId, next, callback) => {
  User.findById(userId, 'teamId').then((user) => {
    if (user.teamId !== null) {
      next(createError(422, 'Already On Team'));
      return;
    }
    Team.findOne({ name }, 'inviteCode', (teamE, team) => {
      if (teamE) {
        debug(`join/team: err: ${teamE}`);
        next(createError(500, 'Internal Error'));
      } else if (team.inviteCode === inviteCode) {
        Team.findByIdAndUpdate(team._id, {
          $push: {
            members: userId,
          },
        }, (updateE) => {
          if (updateE) {
            debug(`join/team: err: ${updateE}`);
            next(createError(500, 'Internal Error'));
          } else {
            User.findByIdAndUpdate(userId, { teamId: team._id }, (userUpdateE) => {
              if (userUpdateE) {
                debug(`join/team: err: ${userUpdateE}`);
                next(createError(500, 'Internal Error'));
              } else {
                callback({ success: true, msg: 'joined team' });
              }
            });
          }
        });
      } else {
        next(createError(403, 'Invalid Invite Code'));
      }
    });
  }).catch((e) => {
    debug(`join/team: err: ${e}`);
    next(createError(500, 'Internal Error'));
  });
};

module.exports = { register, join };
