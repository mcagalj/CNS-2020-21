const globals = rootRequire("globals");
const http = require("http");
const https = require("https");
const authio = rootRequire("security-services/authenticate.io");
const validateProps = rootRequire("utils/validate.props");
const debug = require("debug")("express-web-app:server");

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  switch (error.code) {
    case "EACCES":
      console.error("selected port requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error("selected port is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = this.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}

function ioOnConnection(client) {
  if (!client._username) return client.disconnect();

  client.on("disconnect", () => {
    if (!globals.IO.clients[client._username]) return;
    const { clients } = globals.IO;
    delete clients[client._username];
    globals.IO.clients = clients;
    debug(`IO client disconnect "${client._username}"`);
  });

  const { clients } = globals.IO;
  clients[client._username] = client;
  globals.IO.clients = clients;

  debug("---- Websocket clients -----");
  Object.keys(globals.IO.clients).forEach((client, index) =>
    debug(`${index + 1}.`, client, globals.IO.clients[client].id)
  );
}

function ioOnDisconnect() {
  Object.keys(globals.IO.clients).forEach((client) => client.disconnect());
  globals.IO.clients = {};
}

module.exports = (options) => {
  validateProps([{ name: "app" }, { name: "config" }], options);

  const { app, config } = options;

  validateProps(
    [{ name: "SECURE_SERVER" }, { name: "HTTP" }, { name: "HTTPS" }],
    config
  );

  let port, server;

  // Explicit comparison is intentional here
  if (config.SECURE_SERVER === true) {
    port = normalizePort(config.HTTPS.port);
    server = https.createServer(config.HTTPS, app);
  } else {
    port = normalizePort(config.HTTP.port);
    server = http.createServer(app);
  }

  globals.IO.server = require("socket.io")(server, { cookie: false });
  globals.IO.server.use(authio(config.COOKIESESSIONS));
  globals.IO.server.on("connection", ioOnConnection);
  globals.IO.server.on("disconnect", ioOnDisconnect);

  server.listen(port);
  server.on("error", onError);
  server.on("listening", onListening);

  // Testing...
  server.on("request", (req, res) => {
    const socket = req.connection;
    if (req.path === "/secure") {
      debug(`Try to renegotiate ${JSON.stringify(req.headers["user-agent"])}`);
      socket.renegotiate(
        {
          requestCert: true,
          rejectUnauthorized: false,
        },
        (err) => {
          if (!!err) debug(err);
          debug(req.connection.getPeerCertificate());
        }
      );
    }
  });
};
