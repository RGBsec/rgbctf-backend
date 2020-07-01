const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.send(req.session);
  res.end();
});

module.exports = router;
