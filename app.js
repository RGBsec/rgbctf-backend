const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const debug = require('debug')('rgbctf-backend');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const helmet = require('helmet');
const cors = require('cors');

dotenv.config();
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
  })
  .then((r) => {
    debug(`mongoDB connected to on port ${r.connection.port}`);
  })
  .catch((e) => {
    console.error(`Error connecting to mongodb: ${e.message}`);
    process.exit(-1);
  });

app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.COOKIESECRET,
    saveUninitialized: false,
    unset: 'destroy',
    name: 'rgbctf_session_id',
    resave: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
    }),
  }),
);
app.use(express.static(path.join(__dirname, 'public')));

app.set('port', process.env.PORT || 3000);

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

const server = app.listen(app.get('port'), () => {
  debug(`express started on ${server.address().port}`);
});
