const express = require('express');
const debug = require('debug')('rgbctf-backend');
const createError = require('http-errors');
const Team = require('../../models/team');
const Challenge = require('../../models/challenge');

const router = express.Router();

router.get('/:index', async (req, res, next) => {
  if (!req.session.uid) {
    next(createError(401, 'Unauthorized'));
    return;
  }

  const index = +req.params.index;
  if (index === undefined || Number.isNaN(index) || index === Infinity) {
    next(createError(404, 'Bad Index'));
    return;
  }

  let teams;
  try {
    teams = await Team.find({}, 'name points', {
      skip: index,
      limit: 100,
      sort: {
        points: 1,
      },
    });
  } catch (err) {
    debug(`scoreboard/team: err: ${err.message}`);
    next(createError(500, 'Internal Error'));
    return;
  }

  let challs;
  try {
    challs = await Challenge.find({}, 'points');
  } catch (err) {
    debug(`scoreboard/chall: err: ${err.message}`);
    next(createError(500, 'Internal Error'));
    return;
  }

  res.json({
    success: true,
    totalTeams: teams.length,
    maxPoints: challs.map(({ points }) => points).reduce((prev, curr) => prev + curr, 0),
    teams: teams.map(({ name, points }) => ({ name, points })),
  });
});

module.exports = router;
