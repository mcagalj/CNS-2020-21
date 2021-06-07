const mongoose = require("mongoose");
const validateProps = rootRequire("utils/validate.props");
const debug = require("debug")("express-web-app:db");

module.exports = (options) => {
  const MONGODB = process.env.MONGODB_ADDON_DB || "mongodb://127.0.0.1/lab7";
  const MONGODB_HOST = process.env.MONGODB_ADDON_HOST || "localhost";
  const { config } = options;
  validateProps([{ name: "uri" }, { name: "options" }], config);
  mongoose.Promise = global.Promise;

  const connect = () => {
    debug(`\nConnecting to DB "${MONGODB}" (${MONGODB_HOST})`);
    return mongoose.connect(config.uri, config.options).catch((err) => {
      debug(`Failed to connect to DB "${MONGODB}" (${MONGODB_HOST}).`);
    });
  };

  mongoose.connection.on("connected", function () {
    debug(`Connected to DB "${MONGODB}" (${MONGODB_HOST}).`);
  });

  mongoose.connection.on("error", function (err) {
    debug(`${err}.`);
  });

  mongoose.connection.on("disconnected", function () {
    debug(`Connection to DB "${MONGODB}" (${MONGODB_HOST}) disconnected`);
    setTimeout(() => connect(), config.reconnectAfter);
  });

  process.on("SIGINT", () => {
    mongoose.connection.close(() => {
      debug(`Mongoose connection disconnected `);
      process.exit(0);
    });
  });

  return connect();
};
