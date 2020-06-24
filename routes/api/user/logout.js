const express = require('express');

const router = express.Router();

router.post('/', (req, res) => {
  // Send a success either way so people can't brute tokens
  if (req.session.userId === null) {
    res.send({ success: true, msg: 'logged out' });
  } else {
    delete req.session;
    res.send({ success: true, msg: 'logged out' });
  }
  res.end();
});

module.exports = router;
