const express = require('express');
const debug = require('debug')('rgbctf-backend');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('port', process.env.PORT || 3000);

mongoose.connect(process.env.MONGODB, { useNewUrlParser: true }).then((r) => {
  debug(`mongoDB connected to on port ${r.connection.port}`);
}).catch((e) => {
  debug(`err connecting to mongodb: ${e}`);
});

const server = app.listen(app.get('port'), () => {
  debug(`express started on ${server.address().port}`);
});
