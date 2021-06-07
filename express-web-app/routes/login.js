const express = require('express');
const router = express.Router();
const loginController = rootRequire('controllers/login.controller');

router.get('/', loginController.index);
router.post('/', loginController.verifyCredentials);

module.exports = router;