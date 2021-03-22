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
    // A challenge ciphertext encrypted with the ECB_COOKIE;
    // actually, we use a key derived from the ECB_COOKIE to
    // prepare this challenge (as shown in the sequel).
    const cookiekey = await Crypto.generateKey("PBKDF2", {
      secret: config.ARP_COOKIE,
    });

    challenge = Crypto.encrypt("CBC", {
      key: cookiekey,
      iv: await random(),
      plaintext: config.ARP_CHALLENGE,
    });
    debug("Challenge ready [ARP]: %O", challenge);
  } catch (err) {
    debug(err);
    debug("Cannot proceed. Terminating the application...");
    process.exit(1);
  }
})();

module.exports = {
  index: (req, res) => res.json({ cookie: config.ARP_COOKIE }),
  challenge: (req, res) => res.json(challenge),
};
