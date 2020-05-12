const express = require('express');

const router = express.Router();

router.post('/', (req, res) => {
  if (req.session.userId === null) {
    res.send({ success: false, err: 'already logged out' });
  } else {
    delete req.session;
    res.send({ success: true, msg: 'logged out' });
  }
  res.end();
});

module.exports = router;
