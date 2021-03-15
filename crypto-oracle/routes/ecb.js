"use strict";

const express = require("express");
const router = express.Router();
const controller = rootrequire("controllers/ecb.controller");
const debug = require("debug")("oracle:routes");

router.post("/", controller.encrypt);
router.get("/challenge", controller.challenge);

module.exports = router;
