// Better require() syntax
global.__base = __dirname;
global.rootRequire = name => require(require("path").join(__base, name));

const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cookieSessions = require("client-sessions");
const csrf = require("csurf");
const debug = require("debug")("express-web-app:app");

const config = rootRequire("config");
const validateProps = rootRequire("utils/validate.props");
const auth = rootRequire("security-services/authenticate");
const Session = rootRequire("security-services/session");
const mongoState = rootRequire("mongo-services/mongo.state");

const login = rootRequire("routes/login");
const logout = rootRequire("routes/logout");
const index = rootRequire("routes/index");

const app = express();
app.locals.title = config.INDEX_VIEW.title;

//---------------------------
// APP CONFIG
//---------------------------
// view engine setup
require("hbs").registerPartials(path.join(__dirname, "views/partials"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.enable("view cache");

// Inform the view about the main client script (e.g., index.js)
app.locals.clientMainScript = config.CLIENT_MAIN_SCRIPT;

app.disable("x-powered-by");

//---------------------------
// REGISTER MIDDLEWARE
// (Remember that the order in
//  which you use the middleware
//  matters.)
//---------------------------
app.use(logger("dev"));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieSessions(config.COOKIESESSIONS));
app.use(
  auth({
    ignorePaths: ["/login", "/logout"],
    sessionName: config.COOKIESESSIONS.cookieName,
    failAuthenticate: (req, res) =>
      req.xhr
        ? res.json({
            error: Object.assign({}, config.ERROR_TEXT.ENOTAUTH_AJAX)
          })
        : res.redirect("/login")
  })
);
app.use(mongoState);

//---------------------------
// REGISTER ROUTE HANDLERS
// (Remember that the order in
//  which you use the middleware
//  matters.)
//---------------------------
app.use("/login", login);
app.use(csrf({ cookie: true }));
app.use("/logout", logout);
app.use("/", index);

//---------------------------
// ERROR HANDLERS
//---------------------------
// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error("Not Found");
  err.code = "ENOTFOUND";
  next(err);
});

// ultimate error handler
const { ERROR_TEXT } = config;
validateProps([{ name: "ERROR_TEXT" }], config);

app.use((err, req, res, next) => {
  debug(
    `Requested path: ${req.path}`,
    `Error code: ${err.code}`,
    `Error: ${err.message}`
  );

  if (typeof ERROR_TEXT[err.code] === "undefined") err.code = "ESERVER";

  // Handle ajax requests
  if (req.xhr)
    return res.json({ error: Object.assign({}, ERROR_TEXT[err.code]) });

  // Handle regular requests
  res.status(ERROR_TEXT[err.code].status || 500);
  res.render("index", {
    error: Object.assign(
      { session: Session.isActive(req) },
      ERROR_TEXT[err.code]
    )
  });

  // Uncomment below if you want to terminate the current session upon an error.
  // Session.destroy(req);
});

module.exports = app;
