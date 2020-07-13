const debug = require('debug')('rgbctf-backend');
const createError = require('http-errors');
const Team = require('../models/team');
const User = require('../models/user');

// Register a team, with the user ID as the first user.
const register = (name, inviteCode, userId, callback) => {
  Team.exists({ name }).then((exists) => {
    if (exists) {
      callback(createError(422, 'Team Exists'), null);
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
          callback(createError(500, 'Internal Error'), null); return;
        }
        User.findByIdAndUpdate(userId, { teamId: savedTeam._id }, (updateE) => {
          if (updateE) {
            debug(`create/team: err: ${saveE}`);
            callback(createError(500, 'Internal Error'), null);
          } else {
            callback(null, { success: true, msg: 'team created' });
          }
        });
      });
    }
  }).catch((e) => {
    debug(`create/team: err: ${e}`);
    callback(createError(500, 'Internal Error'), null);
  });
};

// Join a team, with the user ID being the user to add.
const join = (name, inviteCode, userId, callback) => {
  User.findById(userId, 'teamId').then((user) => {
    if (user.teamId !== null) {
      callback(createError(422, 'Already On Team'), null);
      return;
    }
    Team.findOne({ name }, 'inviteCode', (teamE, team) => {
      if (teamE) {
        debug(`join/team: err: ${teamE}`);
        callback(createError(500, 'Internal Error'), null);
      } else if (team.inviteCode === inviteCode) {
        Team.findByIdAndUpdate(team._id, {
          $push: {
            members: userId,
          },
        }, (updateE) => {
          if (updateE) {
            debug(`join/team: err: ${updateE}`);
            callback(createError(500, 'Internal Error'), null);
          } else {
            User.findByIdAndUpdate(userId, { teamId: team._id }, (userUpdateE) => {
              if (userUpdateE) {
                debug(`join/team: err: ${userUpdateE}`);
                callback(createError(500, 'Internal Error'), null);
              } else {
                callback(null, { success: true, msg: 'joined team' });
              }
            });
          }
        });
      } else {
        callback(createError(403, 'Invalid Invite Code'), null);
      }
    });
  }).catch((e) => {
    debug(`join/team: err: ${e}`);
    callback(createError(500, 'Internal Error'), null);
  });
};

module.exports = { register, join };
