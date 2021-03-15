"use strict";

const express = require("express");
const router = express.Router();
const controller = rootrequire("controllers/cbc.controller");
const debug = require("debug")("oracle:routes");

router.post("/iv", controller.predictableiv.encrypt);
router.get("/iv/challenge", controller.predictableiv.challenge);

module.exports = router;
