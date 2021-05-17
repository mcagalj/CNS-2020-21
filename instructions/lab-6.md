# **Kriptografija i mrežna sigurnost - Lab 6**

## Asymmetric cryptography: RSA signatures and DH key exchange

Student će realizirati protokol prikazan u nastavku. Protokol u osnovi implementira autenticirani _Diffie-Hellman key exchange protocol_ i omogućava studentu uspostavu dijeljenog simetričnog ključa sa serverom. Uspostavljeni ključ se u konačnici koristi za zaštitu _challenge_-a (studentovog _challenge_-a koji je i ovaj put vic o Chuck Norrisu).

> **DISCLAIMER: _Prikazani protokol je isključivo edukativne naravi. U ovoj formi protokol nije siguran._**

### Opis protokola

U opisu protokola koristimo sljedeće oznake:

| Oznaka                                 | Opis                                                              |
| -------------------------------------- | :---------------------------------------------------------------- |
| C                                      | klijent (student/ovo računalo)                                    |
| S                                      | server (_crypto oracle_)                                          |
| RSA<sub>priv</sub>                     | privatni RSA key                                                  |
| RSA<sub>priv,C</sub>                   | klijentov privatni RSA ključ                                      |
| RSA<sub>pub</sub>                      | javni RSA ključ                                                   |
| DH<sub>priv</sub>                      | privatni DH ključ                                                 |
| DH<sub>priv,C</sub>                    | klijentov privatni DH ključ                                       |
| DH<sub>pub</sub>                       | javni DH ključ                                                    |
| **Sig**(RSA<sub>priv</sub></sub>, _m_) | RSA digitalno potpisana poruka _m_                                |
| K<sub>DH</sub>                         | dijeljeni DH ključ (i.e., g<sup>xy</sup> mod p)                   |
| K                                      | AES simetrični ključ izveden iz K<sub>DH</sub>                    |
| **AES-256-CTR**(K, _m_)                | enkripcija poruke _m_ u CTR modu s AES šifrom i 256-bit ključem K |
| _a_ \|\| _b_                           | konkatenacija (spajanje) poruka _a_ i _b_                         |

#### Protokol:

| Tko šalje  | Poruka koja se šalje                                                                                                                                   |
| :--------: | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| C &rarr; S | RSA<sub>pub,C</sub>                                                                                                                                    |
| S &rarr; C | RSA<sub>pub,S</sub>                                                                                                                                    |
| C &rarr; S | DH<sub>pub,C</sub> \|\| **Sig**(RSA<sub>priv,C</sub></sub> , DH<sub>pub,C</sub>)                                                                       |
| S &rarr; C | DH<sub>pub,S</sub> \|\| **Sig**(RSA<sub>priv,S</sub></sub> , DH<sub>pub,S</sub> \|\| DH<sub>pub,C</sub>) \|\| **AES-256-CTR**(K, "...Chuck Norris...") |

Klijent C i server S, po uspješnom prijemu odgovarajućih poruka, provjeravaju digitalne potpise, zatim izvode dijeljeni Diffie-Hellman ključ K<sub>DH</sub>, te u konačnici 256-bitni AES ključ K kojim se enkriptira studentova šala. Ključ K izvodi se iz K<sub>DH</sub> kako je prikazano u nastavku:

```js
const K = crypto.pbkdf2Sync(K_DH, "ServerClient", 1, 32, "sha512");
```

> Primjetite da šala u posljednjoj poruci nije autenticirana; ne štitimo njen integritet. U praksi, uz povjerljivost želite zaštititi i integritet poruke.

Zadatak studente je implementirati klijentsku stranu protokola i dekriptirati odgovarajući _challenge_. Profesor će u okviru termina za labove osigurati potrebnu podršku za uspješno rješavanje vježbe.

### Kratki savjeti

#### Generiranje RSA ključeva

Za realizaciju ove vježbe student treba generirati vlastiti par RSA ključeva. Imamo više alternativa: `openssl`, korištenjem kripto-biblioteke u nekom programskom jeziku (Python, JS/Node.js, itd.).

##### Node.js

```js
const crypto = require("crypto");

const RSAKeyPairOptions = {
// Generate 2048-bit RSA key pair
modulusLength: 2048,
publicKeyEncoding: {
    type: "pkcs1",
    format: "pem",
},
privateKeyEncoding: {
    type: "pkcs1",
    format: "pem",
},
};

const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", RSAKeyPairOptions);

// Print the keys
console.log(privateKey);
console.log(publicKey);

// Hex encode the publicKey (required by our server)
const publicKeyHex = Buffer.from(publicKey).toString("hex");

```

#### Digitalno potipisivanje s RSA-om (Node.js)

```js
//---------------------------------------
// Signing/verifying a message using RSA
//
// IMPORTANT: Your should first generate
// RSA key pair (publicKey, privateKey)
//---------------------------------------
const crypto = require("crypto");

const publicKey = ...
const privateKey = ...

const message = "Hello world!"

// Signing a message
const sign = crypto.createSign("RSA-SHA256");
sign.write(message);
sign.end();
const digital_signature = sign.sign(privateKey, "hex");

// Verifying the signature
const verify = crypto.createVerify("RSA-SHA256");
verify.write(message);
verify.end();
const is_signature_ok = verify.verify(publicKey, digital_signature, "hex");

// Print everything
console.log(plaintext);
console.log(digital_signature);
console.log(is_signature_ok)
```

#### Diffie-Hellman, djeljeni tajni ključ i dekripcija vica (Node.js)

1. Uspostava Diffie-Hellman dijeljenog ključa sa serverom pretpostavlja da koristite odgovarajuće DH parametre (multipikativnu grupu i odgovarajući generator grupe). Server koristi tzv. `modp15` Diffie-Helman grupu; ova grupa definirana je u [RFC3526](https://www.rfc-editor.org/rfc/rfc3526.txt). Preporučamo da za generiranje DH ključeva koristite Node.js kako je prikazano u nastavku. Za više detalja pogledajte [dokumentaciju Node.js `crypto` modula](https://nodejs.org/api/crypto.html#crypto_crypto_getdiffiehellman_groupname):

    ```js
    //---------------------------------------
    // Generating DH key pair at the client
    //---------------------------------------
    const crypto = require("crypto");

    const clientDH = crypto.getDiffieHellman("modp15");
    clientDH.generateKeys();

    // Print DH details
    console.log("Group generator:", clientDH.getGenerator("hex"));
    console.log("Group prime:", clientDH.getPrime("hex"));
    console.log("Private DH key:", clientDH.getPrivateKey("hex"));
    console.log("Public DH key:", clientDH.getPublicKey("hex"));
    ```

2. U našem protokolu, klijent primi javni DH ključ od servera. Pohranimo serverov javni DH ključ u varijablu `serverPublicDHKey` (serverov javni DH ključ je `hex` enkodiran). Klijent računa djeljenu tajnu sa severom kako slijedi:

    ```js
    //---------------------------------------
    // The client computes a DH shared key
    // between the server and the client.
    //---------------------------------------
    const sharedDHKey = clientDH.computeSecret(
        Buffer.from(serverDHPublicKey, "hex")
    );

    // Print the shared key
    console.log(sharedDHKey);
    ```

3. Na osnovu djeljenog ključa `sharedDHKey` (koji je predug za direktnu primjenu u AES šifri), klijent izvodi 256-bitni AES ključ kako slijedi:

    ```js
    //---------------------------------------
    // The client derives a 256 bit AES
    // decryption key using well-known
    // key derivation function (kdf) - pbkdf2
    //---------------------------------------
    const crypto = require("crypto");

    const derivedKey = crypto.pbkdf2Sync(
        sharedDHKey,
        "ServerClient",
        1,
        32,
        "sha512"
    );

    // Print the derived key
    console.log("Shared secret key:", derivedKey);
    ```

4. Konačno, dekriptiramo _challenge_ koji je enkriptiran u CTR modu (`aes-256-ctr`) korištenjem izvedenog ključa `derivedKey`.

    ```js
    const crypto = require("crypto");

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
        outputEncoding = "utf8"
    }) {
        const decipher = crypto.createDecipheriv(mode, key, iv);
        decipher.setAutoPadding(padding);

        let plaintext = decipher.update(ciphertext, inputEncoding, outputEncoding);
        plaintext += decipher.final(outputEncoding);
        
        return { plaintext };
    }

    //---------------------------------
    // IMPORTANT: Before running this
    // part you should get the challenge
    // from the server.
    //---------------------------------
    const { plaintext } = decrypt({
        mode: "aes-256-ctr",
        iv: Buffer.from(challenge.iv, "hex"),
        key: derivedKey,
        ciphertext: challenge.ciphertext
    });

    // Voila!
    console.log("PLAINTEXT:", plaintext);
    ```
