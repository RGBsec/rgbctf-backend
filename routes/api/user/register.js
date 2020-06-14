const express = require('express');
const debug = require('debug')('rgbctf-backend');
const Joi = require('@hapi/joi');
const config = require('../../../config');
const User = require('../../../models/user');
const crypto = require('../../../utils/crypto');

const router = express.Router();

const requestSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

router.post('/', (req, res) => {
  const validatedBody = requestSchema.validate(req.body);
  if (validatedBody.error) {
    debug(`register/user: invalid payload: ${JSON.stringify(req.body)}`);
    res.send({ success: false, err: 'invalid payload' });
    res.end();
  }
  const { name, email, password } = validatedBody.value;
  User.exists({ $or: [{email}, {name}] }, (e, exists) => {
    if (e) {
      debug(`register/user: err: ${e}`);
      res.send({ success: false, err: 'internal error' });
      res.end();
      return;
    }
    if (exists) {
      res.send({ success: false, err: 'username or email exists' });
      res.end();
    } else {
      crypto
        .hashPassword(password, config.bcryptCost)
        .then((hashedPassword) => {
          const user = new User({
            name,
            email,
            hash: hashedPassword,
            teamId: null,
            confirmedEmail: false
          });
          // TODO: We need to confirm emails somehow and add more checks for email validation for some other things, where deemed necessary.
          user.save((saveE, savedUser) => {
            if (saveE) {
              debug(`register/user: err: ${saveE}`);
              res.send({ success: false, err: 'internal error' });
              res.end();
              return;
            }
            // eslint-disable-next-line no-underscore-dangle
            req.session.userId = savedUser._id;
            res.send({ success: true, msg: 'registered' });
            res.end();
          });
        });
    }
  });
});

module.exports = router;
