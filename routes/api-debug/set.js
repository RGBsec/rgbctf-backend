const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  req.session.someVal = 'thing'; // { someVal: 'thing' };
  req.session.someVal2 = 'thing';
  res.send({});
  res.end();
});

module.exports = router;
