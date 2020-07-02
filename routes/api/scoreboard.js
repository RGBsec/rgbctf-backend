const express = require('express');
const debug = require('debug')('rgbctf-backend');
const createError = require('http-errors');
const Team = require('../../models/team');
const Challenge = require('../../models/challenge');

const router = express.Router();

router.get('/:index', (req, res, next) => {
  if (!req.session.uid) {
    next(createError(401, 'Unauthorized'));
    return;
  }
  const index = +req.params.index;
  if (index === undefined || Number.isNaN(index) || index === Infinity) {
    next(createError(404, 'Bad Index')); return;
  }

  Team.find({}, 'name points', {
    skip: index,
    limit: 100,
    sort: {
      points: 1,
    },
  }, (e, teams) => {
    if (e) {
      debug(`scoreboard/team: err: ${e}`);
      next(createError(500, 'Internal Error'));
    } else {
      Challenge.find({}, 'points', (challE, challs) => {
        if (challE) {
          debug(`scoreboard/chall: err: ${challE}`);
          next(createError(500, 'Internal Error')); return;
        }
        res.json({
          success: true,
          totalTeams: teams.length,
          maxPoints: challs.map(({ points }) => points).reduce((prev, curr) => prev + curr, 0),
          teams: teams.map(({ name, points }) => ({ name, points })),
        });
        res.end();
      });
    }
  });
});

module.exports = router;
