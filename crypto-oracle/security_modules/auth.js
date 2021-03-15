const debug = require("debug")("oracle:auth");

let API_KEY = undefined;

exports.authorizationParser = params => {
  API_KEY = params.API_KEY;
  const { API_KEY_LENGTH = 100 } = params;

  return (req, _, next) => {
    const { [params.API_KEY_IDENTIFIER]: auth_key } = req.headers;

    if (auth_key) {
      if (auth_key.length > API_KEY_LENGTH) {
        debug(`API_KEY too long ${auth_key.length}`);
        return next();
      }

      req.authorization = { api_key: auth_key };
    }

    return next();
  };
};

exports.authenticate = (req, _, next) => {
  const { api_key } = req.authorization || {};

  // Default policy: reject unauthenticated requests
  if (!API_KEY || !api_key || api_key !== API_KEY) {
    debug(`Request not authorized {API_KEY: ${API_KEY}, api_key: ${api_key}}`);
    const err = Error("Request not authorized");
    err.code = "ENOTAUTHORIZED";
    err.returnJSON = true;
    return next(err);
  }

  return next();
};
