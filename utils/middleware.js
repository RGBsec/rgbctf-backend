const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Team = require('../models/team');

const checkToken = (req, res, next) => {
  const { session } = req.cookies; // Express headers are auto converted to lowercase
  console.log(req.cookies);
  if (session) {
    jwt.verify(session, process.env.COOKIESECRET, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Token is not valid',
        });
      }
      req.decoded = decoded;
      User.findOne({ name: req.decoded.user }, 'name admin teamId', (err1, user) => {
        req.user = user;
        Team.findById(req.user.teamId, (err1, team) => {
          req.team = team;
          next();
        });
      });
    });
  } else {
    return res.json({
      success: false,
      message: 'Auth token is not supplied',
    });
  }
};

module.exports = {
  checkToken,
};
