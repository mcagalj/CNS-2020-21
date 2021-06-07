// Check if authorised for the given action
// (should be run after authentication)
const debug = require('debug')('express-web-app:perm');

module.exports = perm => (req, res, next) => {
        const { user } = req[securitySessionName];
    	if (req.app.locals.Roles.hasPerm(user.perms, perm)) {
    		debug(`"${user.username}" authorized for "${perm}"`);    		
    		return next();
    	} 	

        const err = Error(`User "${user.username}" is not authorized for task "${perm}"`);    err.code = 'ENOTAUTHORIZED';	
        return next(err);
};