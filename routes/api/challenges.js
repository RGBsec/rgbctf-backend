const express = require('express');
const debug = require('debug')('rgbctf-backend');
const createError = require('http-errors');
const Team = require('../../models/team');
const Challenge = require('../../models/challenge');

const middleware = require('../../utils/middleware');

const router = express.Router();

router.get('/', middleware.checkToken, (req, res, next) => {
  console.log(req.team);
  Challenge.find({}, (err, docs) => {
    const challenges = docs.map((challenge) => ({
      name: challenge.name,
      description: challenge.description,
      hints: challenge.hints,
      points: challenge.points,
      solved: req.team.solves.includes(challenge.name),
      category: challenge.category,
    }));
    res.json(challenges);
    res.end();
  });
});

module.exports = router;
