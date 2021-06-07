const Roles = rootRequire('security-services/roles');
const Role = rootRequire('models/role').role;
const Permission = rootRequire('models/role').permission;
const validateProps = rootRequire('utils/validate.props');
const debug = require('debug')('express-web-app:db');

module.exports = options => {
    validateProps([{ name: 'app' }], options);
    validateProps([{ name: 'locals' }], options.app);

    return Promise.all([
        Role.find({}), 
        Permission.find({})
    ])
    .then(results => {
        options.app.locals.Roles = new Roles({ roles: results[0], perms: results[1] });
    })
    .catch(err => { 
        debug(`Failed to initialize a Roles object.`);
        throw Error(err);
    });
};