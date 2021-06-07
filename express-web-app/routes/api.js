const express = require('express');
const router = express.Router();
const apiController = rootRequire('controllers/api.controller');
const authorize = rootRequire('security-services/authorize'); 
const debug = require('debug')('express-web-app:api'); 

router.post('/init', authorize('read'), apiController.init);

router.post('/add', authorize('add'), apiController.add);

router.post('/reset', authorize('reset'), apiController.reset);

module.exports = router;