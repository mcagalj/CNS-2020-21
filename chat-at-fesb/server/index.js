"use strict";

const config = require("config");
const { host, port } = config.get("Server");
const Server = require("./Server.js");

//-------------------------------------
// Create a server instance and run it
//-------------------------------------
new Server({ host, port });
