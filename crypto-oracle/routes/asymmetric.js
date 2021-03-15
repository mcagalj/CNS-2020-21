"use strict";

const express = require("express");
const router = express.Router();
const controller = rootrequire("controllers/asymmetric.controller");
const debug = require("debug")("oracle:routes");

router.post("/rsa/client", controller.clientRSA);
router.get("/rsa/server", controller.serverRSA);
router.post("/dh/client", controller.clientDH);
router.get("/dh-challenge/server", controller.challenge);

module.exports = router;
