const User = rootRequire("models/user");
const Session = rootRequire("security-services/session");
const config = rootRequire("config");
const debug = require("debug")("express-web-app:login");
const LoginText = rootRequire("config").LOGIN_VIEW;

const Responses = {
  ERROR: "ERROR",
  LOGIN: "LOGIN",
  CERT: "CERT",
  SUCCESS: "SUCCESS",
};

const Policies = {
  BASIC: "BASIC",
  ALL_OR_NOTHING: "ALL_OR_NOTHING",
  CERT: "CERT",
};

exports.index = (req, res) => {
  res.render("login", {
    title: LoginText.title,
    message: LoginText.message,
  });
};

exports.verifyCredentials = async (req, res, next) => {
  debug(`User credentials: ${JSON.stringify(req.body)}`);
  const { username, password } = req.body;

  function generateResponse(state) {
    debug(state);
    const { status, message, user } = state;
    const response = {
      [Responses.ERROR]: () => next(Error(message || "")),
      [Responses.LOGIN]: () =>
        res.render("login", {
          title: LoginText.title,
          message: message || LoginText.invalidLogin,
        }),
      [Responses.SUCCESS]: () => {
        // Create a new session cookie for the authenticated user.
        // We store user info (name, perms) in the secured cookie.
        Session.create(req, user);
        return res.redirect("/");
      },
    };

    return typeof response[status] === "function"
      ? response[status]()
      : response.error();
  }

  const LoginHandlers = {
    [Policies.BASIC]: async function basicLogin() {
      //========================================================
      // Policy "BASIC": only "password"
      // verification MUST PASS for successful authentication
      //========================================================
      if (!username || !password) {
        debug("Missing username or/and password.");
        return generateResponse({ status: Responses.LOGIN });
      }

      try {
        // Find and return a user, exclude bio and _id fields
        const user = await User.findOne({ username }, { _id: 0, bio: 0 });

        if (user) {
          await user.verifyPassword(password);
          return generateResponse({ status: Responses.SUCCESS, user });
        }

        let err = Error(`Username "${username}": FAIL`);
        err.status = Responses.LOGIN;
        throw err;
      } catch (err) {
        debug(err.message);
        const status = err.status ? Responses.LOGIN : Responses.ERROR;
        return generateResponse({ status });
      }
    },

    [Policies.ALL_OR_NOTHING]: async function allOrNothingLogin() {
      //========================================================
      // Policy "ALL-OR-NOTHING": both "password" AND "cert"
      // verification MUST PASS for successful authentication
      //========================================================

      if (!username || !password) {
        debug("Missing username or/and password.");
        return generateResponse({ status: Responses.LOGIN });
      }

      try {
        // Find and return a user, exclude bio and _id fields
        const user = await User.findOne({ username }, { _id: 0, bio: 0 });

        if (user) {
          await user.verifyPassword(password);
          await user.verifyCertificate(req);
          return generateResponse({ status: Responses.SUCCESS, user });
        }

        let err = Error(`Username "${username}": FAIL`);
        err.status = Responses.LOGIN;
        throw err;
      } catch (err) {
        debug(err.message);
        const status = err.status ? Responses.LOGIN : Responses.ERROR;
        const message =
          err.status === Responses.CERT ? LoginText.invalidCert : null;
        return generateResponse({ status, message });
      }
    },

    [Policies.CERT]: async function certLogin() {
      //========================================================
      // Policy "CERT": client's certificate verification
      // MUST PASS for successful authentication.
      //========================================================

      if (!username) {
        debug("Missing username");
        const status = Responses.LOGIN;
        const message = "Missing username";
        return generateResponse({ status, message });
      }

      try {
        // Find and return a user, exclude bio and _id fields
        const user = await User.findOne({ username }, { _id: 0, bio: 0 });

        if (user) {
          await user.verifyCertificate(req);
          return generateResponse({ status: Responses.SUCCESS, user });
        }

        let err = Error(`Username "${username}": FAIL`);
        err.status = Responses.LOGIN;
        err.message = "Invalid username";
        throw err;
      } catch (err) {
        debug(err.message);
        const status = err.status ? Responses.LOGIN : Responses.ERROR;
        const message =
          err.status === Responses.CERT ? LoginText.invalidCert : err.message;
        return generateResponse({ status, message });
      }
    },
  };

  try {
    LoginHandlers[config.LOGIN_POLICY]();
  } catch (err) {
    debug(err.message);
    const status = Responses.ERROR;
    return generateResponse({ status });
  }
};
