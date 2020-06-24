const express = require('express');
const debug = require('debug')('rgbctf-backend');
const createError = require('http-errors');
const Team = require('../../models/team');

const router = express.Router();

router.get('/:index', (req, res, next) => {
  const index = +req.params.index;
  if (index === undefined) {
    next(createError(404, 'Bad Index')); return;
  }

  Team.find({}, 'name points', {
    skip: index,
    limit: index + 20,
    sort: {
      points: 1,
    },
  }, (e, teams) => {
    if (e) {
      debug(`login/user: err: ${e}`);
      next(createError(500, 'Internal Error')); return;
    }
    res.send({ success: true, teams: teams.map(({ name, points }) => ({ name, points })) });

    res.end();
  });
});

module.exports = router;
