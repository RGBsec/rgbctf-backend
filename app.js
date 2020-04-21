const express = require('express');
const debug = require('debug')('rgbctf-backend');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('port', process.env.PORT || 3000);

const server = app.listen(app.get('port'), () => {
  debug(`started on ${server.address().port}`);
});
