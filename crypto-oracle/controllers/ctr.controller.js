const debug = require("debug")("oracle:controllers");
const crypto = require("crypto");
const Crypto = rootrequire("crypto_modules/CryptoProvider");
const config = rootrequire("config/config");

// This should be called only once at the onset of the app.
let key = null;
let challenge = null;
let iv = null;

// Initialize the module
(async () => {
  try {
    key = await Crypto.generateKey("RANDOM", 32);
    iv = crypto.randomBytes(16);

    challenge = Crypto.encrypt("CTR", {
      key,
      iv,
      plaintext: config.CTR_CHALLENGE,
    });

    debug("Challenge ready [CTR]: %O", challenge);
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

      // Generate a random low-entropy IV
      const rb = crypto.randomBytes(2);
      iv[0] = rb[0];
      iv[15] = (iv[15] & 0xf0) | (rb[1] & 0x0f);
      debug("New IV:", iv);

      const { iv: test_iv, ciphertext } = Crypto.encrypt("CTR", {
        key,
        iv,
        plaintext: Buffer.from(plaintext, "hex"),
      });

      return res.json({ ciphertext });
    } catch (err) {
      debug(err);
      return next(err);
    }
  },

  challenge: (req, res) => res.json({ ciphertext: challenge.ciphertext }),
};
