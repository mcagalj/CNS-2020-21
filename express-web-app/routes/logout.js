const express = require('express');
const router = express.Router();

const logoutController = require('../controllers/logout.controller');

// NOTE: Only post requests are protected against csrf attacks
router.get('/', logoutController.logout);

router.post('/', logoutController.logout);

module.exports = router;