// Utils for JSON Web Tokens
const debug = require('debug')('rgbctf-backend');
const createError = require('http-errors');
const crypto = require('./crypto');

/*
Informal JWT Schema:
{
  "jti": "<48 bit random number value>",
  "exp": "<36 hours from now>",
  "uid": "<user ID>",
  "tid": "<team ID>"
  "email_confirmed": <is email confirmed, for future use>,
  "admin": <is admin>
}
*/

const getSession = (req) => req.cookies.session || null;
const isSessionRevoked = (req, cb) => {
  // We're taking data from a JWT so we can be sure this is (mostly) safe.
  req.app.locals.redis.exists(`validSessions:${req.session.jti}`, (err, res) => {
    cb(err, !res);
  });
};

const genSessionId = () => {
  const id = crypto.secureRandom(48);
  return id;
};

const revokeSession = (req, id, next) => {
  // We're taking data from a JWT so we can be sure this is (mostly) safe.
  req.app.locals.redis.del(`validSessions:${id}`, (err) => {
    if (err) {
      debug(`session/revoke: err: ${err.message}`);
      next(createError(500, 'Internal Error'));
    }
  });
};

module.exports = {
  getSession,
  revokeSession,
  isSessionRevoked,
  genSessionId,
};
