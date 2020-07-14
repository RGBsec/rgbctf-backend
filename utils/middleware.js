const jwt = require('jsonwebtoken');
const debug = require('debug')('rgbctf-backend');
const createError = require('http-errors');
const sessions = require('./sessions');
const User = require('../models/user');
const Team = require('../models/team');

const resolveUserAndTeam = (req, res, next) => {
  if (req.session.uid) {
    User.findById(req.session.uid, (userE, user) => {
      if (userE) {
        debug(`resolve/user: err: ${userE.message}`);
        next(createError(500, 'Internal Error'));
        return;
      }
      if (!user) {
        next(createError(404, 'User Not Found'));
        return;
      }
      req.user = user;
      if (req.user.teamId) {
        Team.findById(req.user.teamId, (teamE, team) => {
          if (teamE) {
            debug(`resolve/team: err: ${teamE.message}`);
            next(createError(500, 'Internal Error'));
            return;
          }
          if (!team) {
            next(createError(404, 'Team Not Found'));
            return;
          }
          req.team = team;
          next();
        });
      } else {
        next();
      }
    });
  } else {
    next();
  }
};

const revoke = (req, res, next) => {
  if (!req.session) req.session = {};
  if (req.session.jti) {
    sessions.isSessionRevoked(req, (err, revoked) => {
      if (err) {
        debug(`jwt/check valid: err: ${err.message}`);
        next(createError(500, 'Internal Error'));
        return;
      }
      if (revoked) {
        delete req.session.jti;
        res.clearCookie('session');
      }
      next();
    });
  } else {
    next();
  }
};

const session = (req, res, next) => {
  const handler = {
    set: (target, property, value) => {
      if (value !== req.session[value]) {
        const payload = { ...req.session, [property]: value };
        const { jti } = payload;
        delete payload.jti;
        delete payload.exp;
        delete payload.iat;
        try {
          const token = jwt.sign(payload, process.env.COOKIESECRET, {
            expiresIn: '36h',
            algorithm: 'HS256',
            jwtid: jti,
          });
          res.cookie('session', token, {
            //      HR   MIN SEC  MSEC
            maxAge: 36 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: true,
          });
          Reflect.set(target, property, value);
        } catch (err) {
          debug(`jwt/sign+cookie: err: ${err.message}`);
          next(createError(500, 'Internal Error'));
        }
      }
    },
  };
  req.session = new Proxy({ ...req.session }, handler);
  req.revoke = (next2) => {
    if (req.session.jti) {
      sessions.revokeSession(req, req.session.jti, next2);
      res.clearCookie('session');
    }
  };
  next();
};

const sessid = (req, res, next) => {
  if (!req.session) req.session = {};
  if (!req.session.jti) {
    req.session.jti = sessions.genSessionId(req);
    // We're taking data from a JWT so we can be sure this is (mostly) safe.
    req.app.locals.redis.set(`validSessions:${req.session.jti}`, '1', (err) => {
      if (err) {
        debug(`jwt/add valid: err: ${err.message}`);
        next(createError(500, 'Internal Error'));
        return;
      }
      //                                                              HR   MIN SEC
      req.app.locals.redis.expire(`validSessions:${req.session.jti}`, 36 * 60 * 60, (err2) => {
        if (err2) {
          debug(`jwt/add valid: err: ${err.message}`);
          next(createError(500, 'Internal Error'));
          return;
        }
        try {
          const payload = { ...req.session };
          delete payload.jti;
          delete payload.exp;
          delete payload.iat;
          const token = jwt.sign(payload, process.env.COOKIESECRET, {
            expiresIn: '36h',
            algorithm: 'HS256',
            jwtid: req.session.jti,
          });
          res.cookie('session', token, {
            //      HR   MIN SEC  MSEC
            maxAge: 36 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: true,
          });
        } catch (err3) {
          debug(`jwt/sign+cookie: err: ${err3.message}`);
          next(createError(500, 'Internal Error'));
          return;
        }
        next();
      });
    });
  } else {
    next();
  }
};

const utils = (req, res, next) => {
  res.apiRes = (msg, err) => {
    if (msg) {
      res.json({ success: true, msg });
    } else {
      res.json({ success: false, err });
    }
  };
  next();
};

module.exports = {
  session,
  sessid,
  revoke,
  resolveUserAndTeam,
  utils,
};
