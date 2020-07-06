// const session = require('express-session');
// const MongoStore = require('connect-mongo')(session);
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const helmet = require('helmet');
const cors = require('cors');
const ejwt = require('express-jwt');
const redis = require('redis');

dotenv.config();

// The express import is down here as it uses `debug`,
// so using debug with it may help with overall debugging
// when using Express and it doesn't work
const express = require('express');
const debug = require('debug')('rgbctf-backend');

// This has to be done here or debug dies.
const sessions = require('./utils/sessions');
const middleware = require('./utils/middleware');

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
  credentials: true,
};

if (process.env.ALLOWCORS) app.use(cors(corsOptions)); // just for testing the frontend

mongoose
  .connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    dbName: process.env.DBNAME || 'rgbCTF',
  })
  .then((r) => {
    debug(`mongoDB connected on port ${r.connection.port}`);
  })
  .catch((e) => {
    debug(`Error connecting to mongodb: ${e.message}`);
    process.exit(-1);
  });

app.locals.redis = redis.createClient(process.env.REDISPORT || 6379, process.env.REDISHOST || '127.0.0.1');

app.locals.redis.on('connect', () => {
  debug(`redis connected on port ${process.env.REDISPORT || 6379}`);
});

app.use(cookieParser());
app.use(helmet());
app.use(logger('dev'));
app.use(express.json({ strict: true }));
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.set('port', process.env.PORT || 3000);
// Disable X-Powered-By as it's generally not the best idea, though we're running on open source,
// so anyone who knows the source will know that it's using Express. However, it does help prevent
// automated tools from finding data/vulns automatically.
app.disable('x-powered-by');
// We're doing API stuff so we don't want caching, as it messes up a bit of stuff.
app.disable('etag');
app.use(ejwt({
  secret: process.env.COOKIESECRET,
  algorithms: ['HS256'],
  requestProperty: 'session',
  // Make sure we only require a cookie if we want to
  credentialsRequired: false,
  getToken: sessions.getSession,
}));
app.use(middleware.revoke);
app.use(middleware.sessid);
app.use(middleware.session);
app.use(middleware.resolveUserAndTeam);

const getRoutes = (dir) => {
  fs.readdirSync(dir).forEach((p) => {
    const dirPath = path.join(dir, p);
    const isDir = fs.statSync(dirPath).isDirectory();
    if (isDir) {
      getRoutes(dirPath);
    } else {
      debug(`loaded ${dirPath.slice(6, -3)}`);
      // this isn't super airbnby but it's ok bc dynamic api loading
      // eslint-disable-next-line global-require,import/no-dynamic-require
      app.use(dirPath.slice(6, -3), require(`./${dirPath}`));
    }
  });
};
getRoutes('routes');
// eslint-disable-next-line consistent-return
app.use((err, req, res, next) => {
  // No routes handled the request and no system error, that means 404 issue.
  // Forward to next middleware to handle it.
  // TODO: 404 middleware
  if (!err) return next();

  if (req.url.startsWith('/api')) res.locals.success = false;
  // set locals, only providing stack trace in development
  res.locals.message = err.message;
  res.locals.error = err.stack;
  const status = err.status || 500;
  if (!(status >= 400 && status < 500)) {
    // eslint-disable-next-line no-console
    console.log(res.locals.error);
  }
  res.status(status);
  res.json({ success: false, err: err.message });

  // render the error page

  res.end();
});

const server = app.listen(app.get('port'), () => {
  debug(`express started on ${server.address().port}`);
});
