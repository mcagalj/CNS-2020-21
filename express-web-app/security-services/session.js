const Crypto = require("crypto");
const validateProps = rootRequire("utils/validate.props");
const debug = require("debug")("express-web-app:session");

let ACTIVE_SESSIONS = [];

module.exports = {
  create: (req, user) => {
    validateProps([{ name: securitySessionName }], req);
    validateProps([{ name: "Roles" }], req.app.locals);
    validateProps(
      [
        { name: "username", type: "string" },
        { name: "role", type: "string" },
      ],
      user
    );

    const session = req[securitySessionName];
    const { username, role } = user;
    const roles = req.app.locals.Roles.getRoles(role);
    const perms = req.app.locals.Roles.getPermsFor(role);
    const token = Crypto.randomBytes(24).toString("base64");

    session.reset();
    session.user = {
      username: username,
      roles: roles,
      perms: perms,
      token: token,
    };

    ACTIVE_SESSIONS = ACTIVE_SESSIONS.concat([token]);
    debug("ACTIVE_SESSIONS:", ACTIVE_SESSIONS);
    debug(`Session created for user "${username}".`);
    debug(`User "${username}" roles: [${roles}]`);
    debug(`User "${username}" permissions: [${perms}]`);
    debug(`User "${username}" token: ${token}`);
  },

  isActive: (req, res) => {
    const { user } = req[securitySessionName];

    if (!user || !ACTIVE_SESSIONS.includes(user.token)) return false;

    if (!!res) {
      // Exposing user properties to view templates.
      user.roles.forEach((role) => (res.locals[role] = true));
      req.username = user.username;
      debug(`"${user.username}" requested "${req.path}"`);
    }

    return true;
  },

  isTokenActive: (token) => ACTIVE_SESSIONS.includes(token),

  destroy: (req) => {
    const session = req[securitySessionName];

    if (!session.user) return;

    const { username } = session.user;
    // Remove this user from the list of active users
    ACTIVE_SESSIONS.splice(ACTIVE_SESSIONS.indexOf(username), 1);

    // Reset the session
    session.reset();
    debug(`Session destroyed for user "${username}".`);
  },
};
