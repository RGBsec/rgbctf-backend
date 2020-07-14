const express = require('express');
const debug = require('debug')('rgbctf-backend');
const Joi = require('@hapi/joi');
const createError = require('http-errors');
const { promisify } = require('util');
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

router.post('/', async (req, res, next) => {
  const validatedBody = requestSchema.validate(req.body);
  if (validatedBody.error) {
    debug('register/user: invalid payload');
    next(createError(400, 'Invalid Payload'));
    return;
  }
  const { name, email, password } = validatedBody.value;

  try {
    const exists = User.exists({ $or: [{ email }, { name }] });
    if (exists) {
      next(createError(422, 'Username or email already exists'));
      return;
    }
  } catch (err) {
    debug(`register/user: err: ${err.message}`);
    next(createError(500, 'Internal Error'));
    return;
  }

  let hashedPassword;
  try {
    hashedPassword = await crypto.hashPassword(password, config.bcryptCost);
  } catch (err) {
    debug(`register/user: err: ${err.message}`);
    next(createError(500, 'Internal Error'));
    return;
  }

  const user = new User({
    name,
    email,
    hash: hashedPassword,
    teamId: null,
    confirmedEmail: false,
    admin: false,
  });

  try {
    await user.save();
  } catch (err) {
    debug(`register/user: err: ${err.message}`);
    next(createError(500, 'Internal Error'));
    return;
  }

  // TODO: We need to confirm emails somehow and add more checks for
  // email validation for some other things, where deemed necessary.

  req.session.uid = user._id;

  // Create team here, if requested.
  if (validatedBody.value.teamName !== null) {
    const { teamName, inviteCode, createTeam } = validatedBody.value;

    try {
      if (createTeam) {
        await promisify(team.register)(teamName, inviteCode, user._id);
      } else {
        await promisify(team.join)(teamName, inviteCode, user._id);
      }
    } catch (err) {
      // Delete user and invalidate session if team registration failed,
      // this is to avoid pain caused when registering a team and user
      // at the same time and one fails, making you have to go to a
      // separate place to register the team instead of just registering
      // them together again
      try {
        await promisify(req.revoke)();
      } catch (err2) {
        debug(`register/user teamerr/revoke: err: ${err2.message}`);
        next(createError(500, 'Internal Error'));
        return;
      }

      try {
        await User.deleteOne({ _id: user._id });
      } catch (err2) {
        debug(`register/user teamerr/delete: err: ${err2.message}`);
        next(createError(500, 'Internal Error'));
        return;
      }
      next(err);
    }
  }

  // TODO: When sending confirmation on creation of a team,
  // do it here.
  res.apiRes('registered');
});

module.exports = router;
