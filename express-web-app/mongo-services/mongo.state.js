const mongoose = require('mongoose');

module.exports = (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        const err = Error(`Connection ready state: "not connected"`);
        err.code = 'EDATABASE';
        return next(err);
    }
    next();
};