const mongoose = require("mongoose");
const crypto = require("crypto");
const PBKDFv2 = require("../config").PBKDFv2;
const { timingSafeEqual } = require("crypto");
const debug = require("debug")("express-web-app:models");

const UserSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  salt: { type: Buffer, required: true },
  password: { type: Buffer, required: true },
  role: { type: String, required: true },
  bio: String,
});

//---------------------------------------
// Mongoose middleware (pre/post hooks)
//---------------------------------------
// Hash pwd before saving the user.
UserSchema.pre("save", function (next) {
  const user = this;
  crypto.randomBytes(PBKDFv2.saltSize, (err, salt) => {
    if (err) next(err);
    crypto.pbkdf2(
      user.password,
      salt,
      PBKDFv2.iter,
      PBKDFv2.size,
      PBKDFv2.hash,
      (err, hash) => {
        if (err) next(err);
        user.salt = salt;
        user.password = hash;
        next();
      }
    );
  });
});

//---------------------------------------
// User instance methods
//---------------------------------------
UserSchema.methods.verifyPassword = function (password) {
  const user = this;
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      password,
      Buffer.from(user.salt),
      PBKDFv2.iter,
      PBKDFv2.size,
      PBKDFv2.hash,
      (err, hash) => {
        if (err) return reject(err);
        if (timingSafeEqual(hash, Buffer.from(user.password))) {
          debug(`Password verification for "${user.username}": PASS`);
          return resolve();
        }
        let error = Error(`Password verification for "${user.username}": FAIL`);
        error.status = "login";
        reject(error);
      }
    );
  });
};

/**
 * It is your task to modify this instance method in such a way
 * to ensure that only clients with valid/trusted client certificates
 * are successfully authenticated.
 *
 * To accomplish this task you can utilize the following properties
 * of the "req.socket" object:
 *
 * 	 debug("CERT socket.authorized: %s", req.socket.authorized);
 * 	 debug("CERT socket.authorizationError: %s", JSON.stringify(req.socket.authorizationError));
 * 	 debug("CERT socket.getCipher(): %s", JSON.stringify(req.socket.getCipher()));
 * 	 debug("CERT socket.getPeerCertificate():", req.socket.getPeerCertificate(false));
 *
 * HINT: Familiarize yourself with the properties of the "req.socket" object
 * by printing them out (as shown above).
 */
UserSchema.methods.verifyCertificate = function (req) {
  const user = this;

  return new Promise((resolve, reject) => {
    // You should return "resolve" callback only if the client's CERT
    // is successfully verified.
    //
    // IMPORTANT: At the moment we "resolve" without performing any
    // verification of the client/user.

    if (req.socket && req.socket.authorized) {
      const certificate = req.socket.getPeerCertificate(false);
      const {
        subject: { CN },
      } = certificate;

      if (CN && CN === user.username) {
        return resolve();
      }
    }

    // Otherwise, return "reject".
    let error = Error(
      `Certificate verification for user "${user.username}" FAILED with error: ${req.socket.authorizationError}`
    );
    error.status = "CERT";
    reject(error);
  });
};

module.exports = mongoose.model("User", UserSchema);
