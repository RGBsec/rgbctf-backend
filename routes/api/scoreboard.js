const express = require('express');
const debug = require('debug')('rgbctf-backend');
const Team = require('../../models/team');
const Challenge = require('../../models/challenge');

const router = express.Router();

router.get('/:index', (req, res) => {
  const index = +req.params.index;
  if (index === undefined) {
    res.send({ success: false, err: 'bad index' });
    res.end();
    return;
  }
  Team.find({}, 'name points', {
    skip: index,
    sort: {
      points: 1,
    },
  }, (e, teams) => {
    if (e) {
      debug(`scoreboard/team: err: ${e}`);
      res.send({ success: false, err: 'internal error' });
    } else {
      const total = teams.length();
      Challenge.find({}, 'points', (challE, challs) => {
        if (challE) {
          debug(`scoreboard/chall: err: ${challE}`);
          res.send({ success: false, err: 'internal error' });
          return;
        }
        res.send({
          success: true,
          total,
          maxPoints: challs.map(({ points }) => points).reduce((prev, curr) => prev + curr, 0),
          teams: teams.map(({ name, points }) => ({ name, points })),
        });
      });
    }
    res.end();
  });
});

module.exports = router;
