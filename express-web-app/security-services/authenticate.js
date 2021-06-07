const assert = require("assert");
const debug = require("debug")("express-web-app:auth");
const validateProps = rootRequire("utils/validate.props");
const Session = rootRequire("security-services/session");

module.exports = (options) => {
  validateProps(
    [
      { name: "ignorePaths", instance: Array, optional: true },
      { name: "sessionName" },
      { name: "failAuthenticate", type: "function" },
    ],
    options
  );

  const defaultsPaths = ["/login"];
  const {
    ignorePaths = defaultsPaths instanceof Array ? defaultsPaths : [],
    sessionName,
    failAuthenticate,
  } = options;

  global.securitySessionName = sessionName;

  return (req, res, next) => {
    if (!ignorePaths.includes(req.path) && !Session.isActive(req, res)) {
      debug(`Request ${req.path} not authenticated`);
      Session.destroy(req);
      return failAuthenticate(req, res);
    }

    debug(`Authenticated request "${req.path}"`);
    return next();
  };
};
