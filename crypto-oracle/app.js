"use strict";

const path = require("path");

global.__rootdir = __dirname;
global.rootrequire = (name) => require(path.join(__rootdir, name));

const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const debug = require("debug");

const auth = rootrequire("security_modules/auth");
const config = rootrequire("config/config");
const openApiDocumentation = rootrequire("config/openapi.doc");

const arp = rootrequire("routes/arp");
const ecb = rootrequire("routes/ecb");
const cbc = rootrequire("routes/cbc");
const ctr = rootrequire("routes/ctr");
const asymmetric = rootrequire("routes/asymmetric");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  auth.authorizationParser({
    API_KEY: config.API_KEY,
    API_KEY_IDENTIFIER: config.API_KEY_IDENTIFIER,
  })
);

app.use("/", swaggerUi.serve);
app.get("/", swaggerUi.setup(openApiDocumentation));
app.use("/arp", arp);
app.use("/ecb", ecb);
app.use("/cbc", cbc);
app.use("/ctr", ctr);
app.use("/asymmetric", asymmetric);

//---------------------------
// ERROR HANDLERS
//---------------------------
// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.code = "ENOTFOUND";
  next(err);
});

// Ultimate error handler
const { ERRORS } = config;

app.use((err, req, res, next) => {
  debug(
    `Requested path: ${req.path}`,
    `Error code: ${err.code}`,
    `Error: ${err.message}`
  );

  if (typeof ERRORS[err.code] === "undefined") err.code = "ESERVER";

  // Return a JSON response
  if (err.returnJSON || req.xhr || req.is("json")) {
    return res
      .status(ERRORS[err.code].status || 500)
      .json({ error: ERRORS[err.code] });
  }

  // Handle regular requests
  const { title, message, status } = ERRORS[err.code];
  res
    .status(ERRORS[err.code].status || 500)
    .render("error", { title, message, status });
});

module.exports = app;
