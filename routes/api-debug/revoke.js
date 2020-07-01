const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.send(req.revoke(() => res.end()));
});

module.exports = router;
