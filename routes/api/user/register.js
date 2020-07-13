const express = require('express');
const debug = require('debug')('rgbctf-backend');
const Joi = require('@hapi/joi');
const createError = require('http-errors');
const config = require('../../../config');
const User = require('../../../models/user');
const crypto = require('../../../utils/crypto');
const team = require('../../../utils/team');

const router = express.Router();

// Joi schema without a team
const regularSchema = {
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
};

const requestSchema = Joi.alternatives().try(
  Joi.object(regularSchema),
  Joi.object({
    teamName: Joi.string().required(),
    inviteCode: Joi.string().required(),
    createTeam: Joi.boolean().required(),
    ...regularSchema,
  }),
);

router.post('/', (req, res, next) => {
  const validatedBody = requestSchema.validate(req.body);
  if (validatedBody.error) {
    debug('register/user: invalid payload');
    next(createError(400, 'Invalid Payload')); return;
  }
  const { name, email, password } = validatedBody.value;
  User.exists({ $or: [{ email }, { name }] }, (e, exists) => {
    if (e) {
      debug(`register/user: err: ${e}`);
      next(createError(500, 'Internal Error')); return;
    }
    if (exists) {
      next(createError(422, 'Username or email already exists'));
    } else {
      crypto
        .hashPassword(password, config.bcryptCost)
        .then((hashedPassword) => {
          const user = new User({
            name,
            email,
            hash: hashedPassword,
            teamId: null,
            confirmedEmail: false,
            admin: false,
          });
          user.save((saveE) => {
            if (saveE) {
              debug(`register/user: err: ${saveE.message}`);
              next(createError(500, 'Internal Error'));
              return;
            }
            // TODO: We need to confirm emails somehow and add more checks for
            // email validation for some other things, where deemed necessary.

            req.session.uid = user._id;

            // Create team here, if requested.
            if (validatedBody.value.teamName != null) {
              const { teamName, inviteCode, createTeam } = validatedBody.value;
              const handler = (teamE, response) => {
                if (teamE) {
                  // Delete user and invalidate session if team registration failed,
                  // this is to avoid pain caused when registering a team and user
                  // at the same time and one fails, making you have to go to a
                  // separate place to register the team instead of just registering
                  // them together again
                  req.revoke((err) => {
                    if (err) {
                      debug(`register/user teamerr/revoke: err: ${err.message}`);
                      next(createError(500, 'Internal Error'));
                      return;
                    }

                    User.deleteOne({ _id: user._id }, (deleteE) => {
                      if (deleteE) {
                        debug(`register/user teamerr/delete: err: ${deleteE.message}`);
                        next(createError(500, 'Internal Error')); return;
                      }
                      next(teamE);
                    });
                  });

                  return;
                }

                // TODO: When sending confirmation emails WITH creation of a team,
                // do it here.
                res.json({ success: true, msg: 'registered' });
                res.end();
              };
              if (createTeam) team.register(teamName, inviteCode, user._id, handler);
              else team.join(teamName, inviteCode, user._id, handler);
              return;
            }
            // TODO: When sending confirmation WITHOUT creation of a team,
            // do it here.
            res.json({ success: true, msg: 'registered' });
            res.end();
          });
        });
    }
  });
});

module.exports = router;
