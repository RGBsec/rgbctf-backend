const express = require('express');
const debug = require('debug')('rgbctf-backend');
const Challenge = require('../../../models/challenge');

const router = express.Router();

router.post('/api/challenge/addChallenge', (req, res) => {
    debug(`/api/challenge/addChallenge: ${JSON.stringify(req.body)}`);
    const challenge = new Challenge({
        name: req.body.name,
        prerequisites: req.body.prerequisites,
        id: req.body.id,
        description: req.body.description,
        hints: req.body.hints,
        staticScoring: req.body.staticScoring,
        points: req.body.points,
    });
});

module.exports = router;
