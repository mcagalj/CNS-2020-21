const debug = require("debug")("oracle:controllers");
const Crypto = rootrequire("crypto_modules/CryptoProvider");
const random = rootrequire("crypto_modules/random-promise");
const incrementIv = rootrequire("utils/increment-bigint");
const config = rootrequire("config/config");

// This should be called only once at the onset of the app.
let key = null;
let challenge = null;
let iv = null;

// Initialize the module
(async () => {
  try {
    key = await Crypto.generateKey("RANDOM", 32);
    iv = await random();

    challenge = Crypto.encrypt("CBC", {
      key,
      iv,
      plaintext: config.CBC_IV_CHALLENGE,
    });
    debug("Challenge ready [CBC]: %O", challenge);
  } catch (err) {
    debug(err);
    debug("Cannot proceed. Terminating the application...");
    process.exit(1);
  }
})();

module.exports = {
  predictableiv: {
    encrypt: async (req, res, next) => {
      try {
        const { plaintext = "" } = req.body;

        // Please mind that Crypto.encrypt() function is synchronous.
        // As such it can easily block the main/event loop if we try
        // to encrypt too long messages; in production a different
        // approach is needed (use a pool of workers, bg services, etc.).
        if (plaintext.length > config.PLAINTEXT_LIMIT) {
          const err = Error(
            `Plaintext limit exceeded: ${plaintext.length} (${config.PLAINTEXT_LIMIT})`
          );
          err.code = "EPLAINTEXT_LIMIT";
          err.returnJSON = true;
          return next(err);
        }

        // Increment the initialization vector
        // by a fixed know value CBC_IV_INCREMENT
        incrementIv(iv, config.CBC_IV_INCREMENT);
        const challenge = Crypto.encrypt("CBC", {
          key,
          iv,
          plaintext: Buffer.from(plaintext, "hex"),
        });

        return res.json(challenge);
      } catch (err) {
        debug(err);
        err.returnJSON = true;
        return next(err);
      }
    },

    challenge: (req, res) => res.json(challenge),
  },
};
