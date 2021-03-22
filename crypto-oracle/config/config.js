const {
  NODE_ENV = "development",
  HOST = "0.0.0.0",
  PORT = 3000,
  KEY_SEED,
  API_KEY_IDENTIFIER = "crypto-api-key",
  API_KEY,
  ARP_COOKIE,
  ARP_CHALLENGE,
  ECB_COOKIE,
  ECB_CHALLENGE,
  CBC_IV_CHALLENGE,
  CBC_IV_INCREMENT = 4,
  CTR_CHALLENGE = undefined,
  PUBLIC_KEY = undefined,
  PRIVATE_KEY = undefined,
  ASYMM_CHALLENGE = undefined,
} = process.env;

const development = {
  HOST,
  PORT: parseInt(PORT, 10),
  PBKDF2: {
    hash: "sha512",
    size: 32,
    iterations: 50000,
    salt: "salt",
  },

  // A seed used to derive a unique encryption key.
  KEY_SEED,
  API_KEY_IDENTIFIER,
  API_KEY,
  ARP_COOKIE,
  ARP_CHALLENGE,

  // Targeted cookie; each student gets a unique cookie to guess/break.
  ECB_COOKIE: ECB_COOKIE ? String(ECB_COOKIE) : undefined,
  ECB_CHALLENGE,
  PLAINTEXT_LIMIT: 64,
  CBC_IV_CHALLENGE,
  CBC_IV_INCREMENT: parseInt(CBC_IV_INCREMENT, 10),
  CTR_CHALLENGE,
  PUBLIC_KEY,
  PRIVATE_KEY,
  ASYMM_CHALLENGE,

  //-----------------------------
  // VIEW TEXT (for GET requests)
  //-----------------------------
  VIEW: {
    index: {
      title: "Cryptography and Network Security",
      subtitle: "Welcome to crypto labs @FESB",
      table: {
        title: "Crypto ORACLE answers the following queries:",
        header: ["Route path", "Method", "Params", "Response", "Description"],
        rows: [
          {
            title: "/",
            paths: [
              {
                path: "/",
                method: "GET",
                params: "none",
                response: "index.html",
                description: `The index page (this page).`,
              },
            ],
          },
          {
            title: "arp",
            paths: [
              {
                path: "/arp",
                method: "POST",
                params: "{ auth_key: string }",
                response: "{ cookie: string (utf8) }",
                description: `Fetch the COOKIE. This request must be authenticated.`,
              },

              {
                path: "/arp/challenge",
                method: "GET",
                params: "none",
                response: `{ iv: string (hex), ciphertext: string (hex) }`,
                description: `Fetch a challenge encrypted in CBC mode using a key 
                        derived from the COOKIE. The key is derived using pbkdfv2 algorithm.`,
              },
            ],
          },

          {
            title: "ecb",
            paths: [
              {
                path: "/ecb",
                method: "POST",
                params: "{ plaintext: string (utf8) }",
                response: "{ ciphertext: string (hex) }",
                description: `Get an encrypted concatenation of 
                        the plaintext and COOKIE in ECB mode.`,
              },

              {
                path: "/ecb/challenge",
                method: "GET",
                params: "none",
                response: "{ iv: string (hex), ciphertext: string (hex) }",
                description: `Fetch a challenge encrypted in CBC mode using a key 
                        derived from the COOKIE. The key is derived using pbkdf2 algorithm.`,
              },
            ],
          },

          {
            title: "cbc",
            paths: [
              {
                path: "/wordlist.txt",
                method: "GET",
                params: "none",
                response: "wordlist.txt",
                description: `Fetch a file comprising a list of words from 
                        which a challenge word is selected by the "predictable 
                        initialization vector CBC oracle".`,
              },

              {
                path: "/cbc/iv",
                method: "POST",
                params: "{ plaintext: string (hex) }",
                response: "{ iv: string (hex), ciphertext: string (hex) }",
                description: `Get a chosen plaintext word encrypted in CBC mode
                        using a predictable initialization vector (IV).`,
              },

              {
                path: "/cbc/iv/challenge",
                method: "GET",
                params: "none",
                response: "{ iv: string (hex), ciphertext: string (hex) }",
                description: `Fetch a challenge word encrypted in CBC mode using 
                        a predictable initialization vector (IV).`,
              },
            ],
          },

          {
            title: "ctr",
            paths: [
              {
                path: "/ctr",
                method: "POST",
                params: "{ plaintext: string (hex) }",
                response: "{ ciphertext: string (hex) }",
                description: `Fetch an encrypted plaintext in the CTR mode. The 
                        crypto oracle uses a random but low-entropy initialization vector 
                        (IV); i.e., the IV is selected randomly from a small set of values.`,
              },

              {
                path: "/ctr/challenge",
                method: "GET",
                params: "none",
                response: "{ ciphertext: string (hex) }",
                description: `Fetch a challenge encrypted in the CTR mode using 
                        a random but low-entropy initialization vector (IV); i.e., the IV 
                        is selected randomly from a small set of values.`,
              },
            ],
          },

          {
            title: "asymm",
            paths: [
              {
                path: "/asymm/rsa/server",
                method: "GET",
                params: "none",
                response: "{ key: string (hex) }",
                description: `Fetch the server public RSA key.`,
              },

              {
                path: "/asymm/rsa/client",
                method: "POST",
                params: "{ key: string (hex) }",
                response: "{ result: string (utf8) }",
                description: `Upload the client RSA key to the server.`,
              },

              {
                path: "/asymm/dh/client",
                method: "POST",
                params: "{ key: string (hex), signature: string (hex) }",
                response: "{ result: string (utf8) }",
                description: `Send a client DH public key to the server. The DH key is
                        is signed by the client RSA private key. The server verifies the 
                        signature using the client RSA public key.`,
              },

              {
                path: "/asymm/challenge",
                method: "GET",
                params: "none",
                response:
                  "{ key: string (hex), signature: string (hex), challenge: {iv: string (hex), ciphertext: string(hex)} }",
                description: `Fetch a challenge encrypted in the CTR mode using 
                        a random initialization vector (IV) and the AES encryption key that is derived from 
                        the authenticated Diffie-Hellman key exchange. Please note that the AES key is derived using PBKDF2; for details (parameters used to derive the key) please consult the code on the server ("asymm.controller.js" file).`,
              },
            ],
          },
        ],
      },
    },
  },

  //-----------------------------
  // ERROR MESSAGES
  //-----------------------------
  ERRORS: {
    ENOTFOUND: {
      title: "Error",
      message: "Requested resource not found.",
      status: 404,
    },

    EPLAINTEXT_LIMIT: {
      title: "Formatting error",
      message: "You exceeded the plaintext size.",
      status: 400,
    },

    EBAD_PUBLICKEY: {
      title: "Public key error",
      message: "Bad or missing public key",
      status: 400,
    },

    ENOTAUTHORIZED: {
      title: "Authorization Error",
      message: "You are not authorized for the requested resource.",
      status: 401,
    },

    ESERVER: {
      title: "Error",
      message: "Sorry, your request cannot be processed.",
      status: 500,
    },
  },
};

const config = { development };
module.exports = config[NODE_ENV];
