const express = require('express');
const debug = require('debug')('rgbctf-backend');

const router = express.Router();

router.post('/', (req, res) => {
  let data;
  try {
    data = JSON.parse(req.body);
  } catch (e) {
    debug(`err: ${e}`);
    res.send({ err: 'bad data' });
  }
  res.send(data);
});

module.exports = router;
