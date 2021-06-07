const Session = rootRequire('security-services/session');
const debug = require('debug')('express-web-app:logout');

exports.logout = (req, res) => {
    Session.destroy(req);

    // Handle ajax requests
    if (req.xhr) return res.json({ redirect: '/' });

    return res.redirect('/');
};