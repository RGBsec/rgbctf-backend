<h1 align="center">Welcome to rgbCTF 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.0.1-blue.svg?cacheSeconds=2592000" />
  <img src="https://img.shields.io/badge/npm-%3E%3D6.14.4-blue.svg" />
  <img src="https://img.shields.io/badge/node-%3E%3D10.20.1-blue.svg" />
    <a href="https://github.com/RGBsec/rgbctf-backend#readme" target="_blank">
    <img alt="Issues" src="https://img.shields.io/github/issues/RGBsec/rgbctf-backend" />
  </a>

  <a href="https://github.com/RGBsec/rgbctf-backend#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/RGBsec/rgbctf-backend/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/RGBsec/rgbctf-backend/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/RGBsec/rgbctf-backend" />
  </a>
</p>

> MERN-based CTF platform

### 🏠 [Homepage](https://github.com/RGBsec/rgbctf-backend#readme)

### ✨ [Demo (not up currently)](https://ctf.rgbsec.xyz (not up currently))

## Prerequisites

- yarn >=1.22.0
- node >=10.20.1

## Install

```sh
yarn install
```

## Usage

Create a `.env` file in the local directory with these values:

- `MONGODB`: Required. This is a [MongoDB connection string](https://docs.mongodb.com/manual/reference/connection-string/) used to connect to the backend database. If authentication or SSL is enabled, you must specify that in the connection string via the respective fields.
- `DBNAME`: Optional. The MongoDB database name to use . Defaults to `rgbCTF`.
- `COOKIESECRET`: Required. This is the secret used for [express-session](https://www.npmjs.com/package/express-session). This is used to sign the session ID cookie. It is recommended that this value is randomly generated.
- `PORT`: Optional. This is the port used for this application. It defaults to `3000` if not specified.
- `DEBUG`: Optional. Setting it to "rgbctf-backend" will cause debug messages to be logged. See the [`debug`](https://www.npmjs.com/package/debug) docs. Setting it to `express:*` or adding `,express:*` will enable Express debugging as well (warning: Express debug output is **extremely** verbose).
- `NODE_ENV`: Optional. Set to `production` in production, as it disables development features in Express which can reduce performance/reliability.
- `REDISPORT`: Optional. The port for the Redis instance. Defaults to `6379`.
- `REDISHOST`: Optional. The host for the Redis instance. Defaults to `127.0.0.1`.
- `ALLOWCORS`: Optional. If present with any non-empty string, CORS will be enabled with an origin of `http://localhost:3000`. This is mainly used for testing the frontend with the API.

Then, to start the application, run:

```sh
yarn start
```

## Author

👤 **RGBsec**

* Website: https://rgbsec.xyz/
* Github: [@RGBsec](https://github.com/RGBsec)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/RGBsec/rgbctf-backend/issues). You can also take a look at the [contributing guide](https://github.com/RGBsec/rgbctf-backend/blob/master/CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2020 [RGBsec](https://github.com/RGBsec).<br />
This project is [MIT](https://github.com/RGBsec/rgbctf-backend/blob/master/LICENSE) licensed.
