const debug = require("debug")("oracle:controllers");
const Crypto = rootrequire("crypto_modules/CryptoProvider");
const random = rootrequire("crypto_modules/random-promise");
const config = rootrequire("config/config");

// This should be called only once at the onset of the app.
let key = null;
let challenge = null;

// Initialize the module
(async () => {
  try {
    key = await Crypto.generateKey("PBKDF2", { secret: config.KEY_SEED });

    // A challenge ciphertext encrypted with the ECB_COOKIE;
    // actually, we use a key derived from the ECB_COOKIE to
    // prepare this challenge (as shown in the sequel).
    const cookiekey = await Crypto.generateKey("PBKDF2", {
      secret: config.ECB_COOKIE,
    });

    challenge = Crypto.encrypt("CBC", {
      key: cookiekey,
      iv: await random(),
      plaintext: config.ECB_CHALLENGE,
    });
    debug("Challenge ready [ECB]: %O", challenge);
  } catch (err) {
    debug(err);
    debug("Cannot proceed. Terminating the application...");
    process.exit(1);
  }
})();

module.exports = {
  encrypt: async (req, res, next) => {
    try {
      const { plaintext = "" } = req.body;

      // Please mind that Crypto.encrypt() function is synchronous.
      // As such it can easily block the main/event loop if we try
      // to encrypt too long messages; in production a different
      // approach is needed (use a pool of workes, bg services, etc.).
      if (plaintext.length > config.PLAINTEXT_LIMIT) {
        const err = Error(
          `Plaintext limit exceeded: ${plaintext.length} (${config.PLAINTEXT_LIMIT})`
        );
        err.code = "EPLAINTEXT_LIMIT";
        return next(err);
      }

      const { ciphertext } = Crypto.encrypt("ECB", {
        key,
        plaintext: plaintext.concat(config.ECB_COOKIE),
      });

      return res.json({ ciphertext });
    } catch (err) {
      debug(err);
      return next(err);
    }
  },

  challenge: (req, res) => res.json(challenge),
};
