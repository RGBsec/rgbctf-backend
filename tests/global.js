const dotenv = require('dotenv');
const assert = require('assert');
const mongoose = require('mongoose');
const redis = require('redis');
const { once } = require('events');

dotenv.config();
const debug = require('debug')('rgbctf-backend');

const connect = async () => {
  // I know global variables aren't exactly the *best*,
  // but it allows us to prevent having to connect/disconnect
  // once per test
  if (global.state) return;
  global.state = {};
  await mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    dbName: 'rgbCTF-testdata',
  });
  global.state.redis = redis.createClient(process.env.REDISPORT || 6379, process.env.REDISHOST || '127.0.0.1');
  await once(global.state.redis, 'connect');
};

module.exports = {
  assert,
  debug,
  connect,
};
