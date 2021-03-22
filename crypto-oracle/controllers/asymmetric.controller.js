const fs = require("fs");
const path = require("path");
const debug = require("debug")("oracle:controllers");
const config = rootrequire("config/config");
const crypto = require("crypto");
const Crypto = rootrequire("crypto_modules/CryptoProvider");

const serverRSAPublic = config.PUBLIC_KEY;
const serverRSAPrivate = config.PRIVATE_KEY;
// const serverRSAPublic = fs.readFileSync(path.join(__dirname, 'public.pem'))
// const serverRSAPrivate = fs.readFileSync(path.join(__dirname, 'private.pem'))

let clientRSAPublic = undefined;
let clientDHPublic = undefined;
let challenge = null;

debug("RSA keys loaded ...");
// debug("Server public RSA key:", serverRSAPublic);

/**
 * STEP 1: A client sends its public RSA key to the server.
 */
exports.clientRSA = (req, res, next) => {
  const { key = undefined } = req.body;

  //========================================================
  // Test the format of the submitted client RSA public key
  //========================================================
  try {
    clientRSAPublic = Buffer.from(key, "hex").toString();

    crypto.publicEncrypt(
      {
        key: clientRSAPublic,
        // We use an insecure padding in this test since it is
        // faster than OAEP padding; there is no harm in doing
        // this since here we encrypt only locally to test
        // the correctness of the format of the submitted key.
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from("0")
    );
  } catch (err) {
    clientRSAPublic = undefined;
    debug(err);
    err.code = "EBAD_PUBLICKEY";
    err.returnJSON = true;
    return next(err);
  }

  res.end();
};

/**
 * STEP 2: The server responds with its public RSA key.
 */
exports.serverRSA = (_, res) => {
  res.json({
    key: Buffer.from(serverRSAPublic).toString("hex"),
  });
};

/**
 * STEP 3: Client initiate the DH key exchange with the server.
 */
exports.clientDH = (req, res, next) => {
  if (!clientRSAPublic) {
    return res.status(400).json({
      title: "Missing Key",
      message:
        "Missing the client's public RSA key. Please make sure that you have run all the previous steps of the protocol.",
    });
  }

  let { key = undefined, signature = undefined } = req.body;

  try {
    clientDHPublic = Buffer.from(key, "hex");

    //================================================================
    // Verify the signature over the client DH public key.
    // The key is signed by the client using his/her RSA private key.
    //================================================================
    const verify = crypto.createVerify("RSA-SHA256");
    verify.write(clientDHPublic.toString("hex"));
    verify.end();

    if (!verify.verify(clientRSAPublic.toString("base64"), signature, "hex")) {
      clientDHPublic = undefined;
      return res.status(401).json({
        title: "Invalid Signature",
        message:
          "Could not verify the signature over the client's DH public key.",
      });
    }

    res.end();
  } catch (err) {
    clientDHPublic = undefined;
    debug(err);
    err.code = "EBAD_PUBLICKEY";
    err.returnJSON = true;
    return next(err);
  }
};

/**
 * STEP 4: The server finishes the DH key exchange and
 * sends an encrypted challenge back to the client.
 */
exports.challenge = (_, res, next) => {
  if (!clientDHPublic) {
    return res.status(400).json({
      title: "Missing Key",
      message:
        "Missing the client's public DH. Please make sure that you have run all the previous steps of the protocol.",
    });
  }

  let serverDH = undefined;
  let signature = undefined;

  try {
    //======================================
    // Generate ephemeral/one-time DH keys.
    // By using these keys only once, we
    // ensure the forward secrecy property.
    //======================================
    serverDH = crypto.getDiffieHellman("modp15");
    serverDH.generateKeys();

    //=============================================================
    // The server signs the concatenation of the server and client
    // DH public keys using its RSA private key.
    //=============================================================
    const sign = crypto.createSign("RSA-SHA256");
    sign.write(serverDH.getPublicKey("hex") + clientDHPublic.toString("hex"));
    sign.end();
    signature = sign.sign(serverRSAPrivate, "hex");

    //===============================================================
    // Compute a DH shared key between the server and the client and
    // use it to derive a 256 bit AES encryption key.
    //===============================================================
    const dhSharedKey = serverDH.computeSecret(clientDHPublic);
    const derivedKey = crypto.pbkdf2Sync(
      dhSharedKey,
      "ServerClient",
      1,
      32,
      "sha512"
    );

    //====================================================
    // Finally, encrypt the challenge in AES-256-CTR mode
    // using the derived/agreed key.
    //====================================================
    challenge = Crypto.encrypt("CTR", {
      key: derivedKey,
      iv: Buffer.alloc(16),
      plaintext: config.ASYMM_CHALLENGE,
    });
  } catch (err) {
    debug(err);
    err.returnJSON = true;
    return next(err);
  }

  // Please note that we only protect the confidentiality
  // of the challenge; no integrity protection is used.
  res.json({
    key: serverDH.getPublicKey("hex"),
    signature,
    challenge,
  });

  // A DH key should be used only once in order to ensure
  // the forward secrecy property.
  serverDH = undefined;
  clientDHPublic = undefined;
  dhSharedKey = undefined;
  derivedKey = undefined;
};
