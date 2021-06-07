const parse = require('cookie').parse;
const decode = require('client-sessions').util.decode;
const assert = require('assert');
const validateProps = rootRequire('utils/validate.props');
const Session = rootRequire('security-services/session');

module.exports = options => {
    validateProps([
        {name: 'cookieName', type: 'string'},
        {name: 'secret', type: 'string'}
    ], options);
    
    const { cookieName, secret } = options;

    return (socket, next) => {
       const cookie = parse(socket.handshake.headers.cookie)[cookieName]; 

       if (!cookie) {
           const err = Error(`Missing cookie.`);
           err.code = 'ENOTAUTHORIZED';
           return next(err);           
       }             
       
       const user = decode(options, cookie).content.user;

       if (!user || !Session.isTokenActive(user.token)) {
           const err = Error(`User not present in the cookie or the session is inactive.`);
           err.code = 'ENOTAUTHORIZED';
           return next(err);
       }

       socket._username = user.username;
       next();
    };
};