const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    team: req.team,
    user: req.user,
    jwt: req.session,
  });
  res.end();
});

module.exports = router;
