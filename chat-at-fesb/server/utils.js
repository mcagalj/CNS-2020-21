// Set DEBUG=server to see output
const debug = require("debug")("server");
const chalk = require("chalk");

const log = {
  info: msg => debug(msg),
  emph: msg => debug(chalk.green(msg)),
  important: msg => debug(chalk.yellow(msg)),
  error: (error, msg) => {
    debug(chalk.red(msg));
    if (error) debug(error);
  }
};

/**
 * Try to stringify a given object and return `undefined`
 * if JSON.stringify fails; confines potential SyntaxError
 * exceptions.
 *
 * @param {*} json
 */
function JSONstringify(json) {
  let stringified = undefined;

  try {
    stringified = JSON.stringify(json);
  } catch (error) {
    log.error(error, "JSON.stringify error");
  }

  return stringified;
}

/**
 * Try to parse the given object and return `undefined`
 * if JSON.parse fails;  confines potential SyntaxError
 * exceptions.
 *
 * @param {*} json
 */
function JSONparse(json) {
  let parsed = undefined;

  try {
    parsed = JSON.parse(json);
  } catch (error) {
    log.error(error, `JSON.parse error`);
  }

  return parsed;
}

module.exports = {
  JSONparse,
  JSONstringify,
  log
};
