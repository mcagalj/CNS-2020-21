"use strict";

const express = require("express");
const router = express.Router();
const controller = rootrequire("controllers/arp.controller");
const auth = rootrequire("security_modules/auth");
const debug = require("debug")("oracle:routes");

router.get("/", auth.authenticate, controller.index);
router.get("/challenge", controller.challenge);

module.exports = router;
