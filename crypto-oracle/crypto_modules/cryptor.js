const crypto = require("crypto");

const DEFAULTS = {
  salt: "salt",
  iterations: 300000,
  size: 32,
  hash: "sha512",
};

//---------------------------------
// Promisfied pbkdf2
//---------------------------------
function pbkdf2({ cookie, salt, iterations, size, hash } = DEFAULTS) {
  iterations = +iterations;
  size = +size;
  salt = salt ? salt : DEFAULTS.salt;
  iterations = iterations > 0 ? iterations : DEFAULTS.iterations;
  size = size > 0 ? size : DEFAULTS.size;
  hash = crypto.getHashes().includes(hash) ? hash : DEFAULTS.hash;
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(cookie, salt, iterations, size, hash, (err, key) =>
      err
        ? reject(Error(`Failed to generate a key with error: ${err}`))
        : resolve(key)
    );
  });
}

//---------------------------------
// Encryptor
//---------------------------------
function encrypt({
  mode,
  key,
  iv = Buffer.alloc(0),
  plaintext,
  padding = true,
  inputEncoding = "utf8",
  outputEncoding = "hex",
}) {
  const cipher = crypto.createCipheriv(mode, key, iv);
  cipher.setAutoPadding(padding);
  let ciphertext = cipher.update(plaintext, inputEncoding, outputEncoding);
  ciphertext += cipher.final(outputEncoding);

  return {
    iv: iv.toString(outputEncoding),
    ciphertext,
  };
}

//---------------------------------
// Decryptor
//---------------------------------
function decrypt({
  mode,
  key,
  iv = Buffer.alloc(0),
  ciphertext,
  padding = true,
  inputEncoding = "hex",
  outputEncoding = "utf8",
}) {
  const decipher = crypto.createDecipheriv(mode, key, iv);
  decipher.setAutoPadding(padding);
  let plaintext = decipher.update(ciphertext, inputEncoding, outputEncoding);
  plaintext += decipher.final(outputEncoding);
  return { plaintext };
}

//--------------------------------------
// Testing encryptor with 'aes-256-cbc'
//--------------------------------------
(async () => {
  try {
    const mode = "aes-256-cbc";
    const key = await pbkdf2({ cookie: "zelursirronkcuhc" });
    const iv = Buffer.from("711324d3dc0ab9508f551f327111ddb9", "hex");
    const plaintext = "ECB: Chuck Norris je zatvorio Otvoreni radio.";

    const ciphertext = encrypt({ mode, iv, key, plaintext });

    console.log("Encryptor:", ciphertext);
  } catch (err) {
    console.error(err);
  }
})();

//-------------------------------------
// Testing decryptor with 'aes-256-cbc'
//-------------------------------------
(async () => {
  try {
    const mode = "aes-256-cbc";
    const key = await pbkdf2({ cookie: "zelursirronkcuhc" });
    const iv = Buffer.from("711324d3dc0ab9508f551f327111ddb9", "hex");
    const ciphertext =
      "8e2f59bd9114d626d65a738d1b7860d09e491fff39b120b9c91c49b3b91292153b7642eb440f983104f2ca73bda213f3";

    const plaintext = decrypt({ mode, iv, key, ciphertext });

    console.log("Decryptor:", plaintext);
  } catch (err) {
    console.error(err);
  }
})();
