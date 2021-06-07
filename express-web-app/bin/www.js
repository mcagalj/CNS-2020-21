const path = require('path');
const app = require('../app');
const config = rootRequire('config');
const debug = require('debug')('express-web-app:server');

//---------------------------
// INIT APP
//---------------------------
const requireInitializer = name => require(path.join(__base, 'initializers', name));

requireInitializer('db.init')({ config: config.MONGODB })
.then(() => requireInitializer('roles.init')({ app: app }))
.then(() => requireInitializer('server.init')({ app: app, config: config }))
.catch(err => {
    debug(err);  
    debug('Server could not be started. Terminating the application...');
    process.exit(1);
});