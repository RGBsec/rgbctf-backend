const express = require('express');
const debug = require('debug')('rgbctf-backend');
const Team = require('../../models/team');
const User = require('../../models/user');

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
    limit: index + 20,
    sort: {
      points: 1,
    },
  }, (e, teams) => {
    if (e) {
      debug(`login/user: err: ${e}`);
      res.send({ success: false, err: 'internal error' });
    } else {
      res.send({ success: true, teams: teams.map(({ name, points }) => ({ name, points })) });
    }
    res.end();
  });
});

module.exports = router;
