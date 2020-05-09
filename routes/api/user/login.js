const express = require('express');
const debug = require('debug')('rgbctf-backend');
const Joi = require('@hapi/joi');
const User = require('../../../models/user');
const crypto = require('../../../utils/crypto');

const router = express.Router();
const requestSchema = Joi.object({
  name: Joi.string(),
  password: Joi.string(),
});


router.post('/', (req, res) => {
  const validatedBody = requestSchema.validate(req.body);
  if (validatedBody.error) {
    res.send({ sucess: false, err: 'invalid payload' });
    res.end();
  }
  const user = User.findOne({ name: validatedBody.value.name });
  console.log(user);
});

module.exports = router;
