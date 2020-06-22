const debug = require('debug')('rgbctf-backend');
const Team = require('../models/team');
const User = require('../models/user');

// Register a team, with the user ID as the first user.
const register = (name, inviteCode, userId, callback) => {
  Team.exists({ name }).then((exists) => {
    if (exists) {
      callback({ success: false, err: 'team name exists' });
    } else {
      const team = new Team({
        name,
        inviteCode,
        members: [userId],
        points: 0,
      });
      team.save((saveE, savedTeam) => {
        if (saveE) {
          debug(`create/team: err: ${saveE}`);
          callback({ success: false, err: 'internal error' });
          return;
        }
        // eslint-disable-next-line no-underscore-dangle
        User.findByIdAndUpdate(userId, { teamId: savedTeam._id }, (updateE) => {
          if (updateE) {
            debug(`create/team: err: ${saveE}`);
            callback({ success: false, err: 'internal error' });
          } else {
            callback({ success: true, msg: 'team created' });
          }
        });
      });
    }
  }).catch((e) => {
    debug(`create/team: err: ${e}`);
    callback({ sucess: false, err: 'internal error' });
  });
};

const join = (name, inviteCode, userId, callback) => {
  User.findById(userId, 'teamId').then((user) => {
    if (user.teamId !== null) {
      callback({ success: false, err: 'already on team' });
      return;
    }
    Team.findOne({ name }, 'inviteCode', (teamE, team) => {
      if (teamE) {
        debug(`join/team: err: ${teamE}`);
        callback({ success: false, err: 'internal error' });
      } else if (team.inviteCode === inviteCode) {
        // eslint-disable-next-line no-underscore-dangle
        Team.findByIdAndUpdate(team._id, {
          $push: {
            members: userId,
          },
        }, (updateE) => {
          if (updateE) {
            debug(`join/team: err: ${updateE}`);
            callback({ success: false, err: 'internal error' });
          } else {
            // eslint-disable-next-line no-underscore-dangle
            User.findByIdAndUpdate(userId, { teamId: team._id }, (userUpdateE) => {
              if (userUpdateE) {
                debug(`join/team: err: ${userUpdateE}`);
                callback({ success: false, err: 'internal error' });
              } else {
                callback({ success: true, msg: 'joined team' });
              }
            });
          }
        });
      } else {
        callback({ success: false, err: 'wrong invite code' });
      }
    });
  }).catch((e) => {
    debug(`join/team: err: ${e}`);
    callback({ success: false, err: 'internal error' });
  });
};

module.exports = { register, join };
