const fs = require("fs");
const path = require("path");

// HTTP or HTTPS server
const HTTPS = false;

module.exports = {
  //-----------------------------
  // MONGODB CONFIG DATA
  //-----------------------------
  MONGODB: {
    uri:
      `mongodb://${process.env.MONGODB_ADDON_USER}:${process.env.MONGODB_ADDON_PASSWORD}@bd8xzubzzn6t1ue-mongodb.services.clever-cloud.com:${process.env.MONGODB_ADDON_PORT}/${process.env.MONGODB_ADDON_DB}` ||
      "mongodb://127.0.0.1/lab7",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    },
    reconnectAfter: 3000,
  },

  //-----------------------------
  // HTTP or HTTPS
  //-----------------------------
  SECURE_SERVER: HTTPS,

  //-----------------------------
  // Login policies:
  //       - BASIC
  //       - ALL_OR_NOTHING
  //       - CERT
  //-----------------------------
  LOGIN_POLICY: process.env.LOGIN_POLICY || "BASIC",

  //-----------------------------
  // HTTP SERVER CONFIG DATA
  //-----------------------------
  HTTP: {
    port: process.env.PORT || 8000,
  },

  //-----------------------------
  // HTTPS SERVER CONFIG DATA
  //-----------------------------
  HTTPS: HTTPS
    ? {
        port: process.env.HTTPS_PORT || 4430,
        key:
          process.env.SERVER_KEY ||
          fs.readFileSync(
            path.join(__dirname, "certs", "server", "server-key.pem")
          ),
        cert:
          process.env.SERVER_CERT ||
          fs.readFileSync(
            path.join(__dirname, "certs", "server", "server-cert.pem")
          ),
        ca:
          process.env.CA_CERT ||
          fs.readFileSync(path.join(__dirname, "certs", "ca", "ca.pem")),

        // If true the server will request a certificate
        // from clients that connect and attempt to verify that certificate.
        requestCert: false,

        // If true the server will reject any connection
        // which is not authorized with the list of supplied CAs.
        // This option only has an effect if requestCert is true.
        // (https://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener)
        rejectUnauthorized: false,
        honorCipherOrder: true,

        ciphers:
          "ECDH+AESGCM:DH+AESGCM:ECDH+AES256:DH+AES256:ECDH+AES128:DH+AES:RSA+AES:!aNULL:!MD5:!DSS",
      }
    : null,

  //-----------------------------
  // PASSWORD HASHING CONFIG
  //-----------------------------
  PBKDFv2: {
    hash: "sha256",
    size: 20,
    saltSize: 20,
    iter: 50000,
  },

  //-----------------------------
  // COOKIE-SESSIONS CONFIG
  //-----------------------------
  COOKIESESSIONS: {
    cookieName: process.env.COOKIE_NAME || "_fesbSession",
    secret: process.env.COOKIE_SECRET || "3y-UnbreakaB1e_Secre7",
    duration: 5 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    cookie: {
      // is the cookie available to javascript
      httpOnly: true,
      // should the cookie be sent only via a secure TLS connection
      secure: HTTPS,
      ephemeral: true,
      sameSite: "Strict",
    },
  },

  //-----------------------------
  // INDEX VIEW TEXT
  //-----------------------------
  INDEX_VIEW: {
    title: "CryptoLabs@FESB",
  },

  //-----------------------------
  // LOGIN VIEW TEXT
  //-----------------------------
  LOGIN_VIEW: {
    title: "Login to CryptoLabs@FESB",
    message: "Please enter your login credentials.",
    invalidLogin: "Invalid username or password.",
    invalidCert: "Invalid certificate.",
  },

  //-----------------------------
  // ERROR MESSAGES
  //-----------------------------
  ERROR_TEXT: {
    ENOTFOUND: {
      title: "Error",
      message: "Requested resource not found.",
      status: 404,
    },

    EDATABASE: {
      title: "Database error",
      message: `Your request cannot be processed at the moment. Please try again later. If the problem persists please contant the administrator at admin@admin.hr`,
    },

    EUSERFAILURE: {
      title: "Error",
      message: `Requested user does not exist. Please contant the 
                      administrator at admin@admin.hr`,
    },

    ENOTAUTH_AJAX: {
      title: "Authentication Error",
      message: `Your request is not authenticated (or you session has expired). 
                      Please try to login again.`,
      status: 401,
    },

    ENOTAUTHORIZED: {
      title: "Authorization Error",
      message: "You are not authorized for the requested resource.",
      status: 403,
    },

    EBADCSRFTOKEN: {
      title: "Authorization Error",
      message: "Missing or invalid CSRF token. Try to reload the webpage.",
      status: 403,
    },

    ESERVER: {
      title: "Error",
      message: "Sorry, your request cannot be processed.",
      status: 500,
    },
  },

  //-----------------------------
  // CLIENT MAIN SCRIPT
  //-----------------------------
  CLIENT_MAIN_SCRIPT: "index.js",
};
