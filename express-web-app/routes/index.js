const express = require('express');
const router = express.Router();
const api = rootRequire('routes/api');
const indexController = rootRequire('controllers/index.controller');

// Main page
router.get('/', indexController.index);

// Chart data api
router.use('/api', api);

module.exports = router;