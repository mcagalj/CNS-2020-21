# **Kriptografija i mrežna sigurnost - Lab 2**

## _Crypto Oracle_: Setting up the stage

U narednih nekoliko vježbi student će raditi u interakciji sa jednostavnim REST serverom kojeg kolokvijalno nazivamo **_crypto oracle_**. _Crypto oracle_ (server) generira odgovarajuće izazove u obliku enkriptiranog teksta koje student treba rješiti/dekriptirati. Dekripcijski ključ student treba otkriti u interakciji sa serverom. U osnovi student treba otkriti način na koji može otključati/dekriptirati izazov (_challenge_) koji je u osnovi kratka šala o Chuck Norrisu.

### Instalacija i pokretanje _Crypto Oracle_ servera

Vidi upute na poveznici [instalacija i pokretanje _crypto oracle_ servera](intro.md).

### Postupak dekripcije izazova

Vaši izazovi enkriptirani su AES šifrom u CBC enkripcijskom modu (AES-CBC); navedene kratice i terminologija vam u ovom trenutku možda ne znače previše, no s vremenom će sve sjesti na svoje mjesto. Ključ za enkripciju/dekripciju izvodi se iz odgovarajuće tajne vrijednosti koju u okviru labova zovemo _cookie_.  Ključ se izvodi primjenom _[Password-Based Key Derivation Function 2](https://en.wikipedia.org/wiki/PBKDF2)_ (`PBKDF2`). Ispravnim dekripcijskim ključem možete rješiti izazov u okviru ove vježbe - dekriptirati šifrirani tekst.

Generalno, za izvođenje dekripcijskog ključa kao i za samu dekripciju šifriranog teksta možete koristiti proizvoljnu _crypto_ biblioteku u programskom jeziku po želji ili čak _online_ servis koji implementira PBKDF2 i AEC-CBC.

> Naša preporuka je pak da za navedene zadaće koristite Node.js skriptu `cryptor.js` koja se nalazi u direktoriju [crypto-oracle/crypto_modules](/crypto-oracle/crypto_modules).

1. Kopirajte skriptu `cryptor.js` u odgovarajući direktorij (npr. `mcagalj/solutions`).

2. Otvorite `cryptor.js` u editoru i prilagodite parametre: ubacite svoj _cookie_, šifrirani tekst (_ciphertext_), te inicijalizacijski vektor (_iv_) u naznačena mjesta u _decryptor_-u kako je prikazano u primjeru u nastavku.

    > Terminologija vam u ovom trenutku možda izgleda konfuzno i nejasno, obećavamo s vremenom će sve sjesti na svoje mjesto.

    ```js
    //-------------------------------------
    // Decryptor with 'aes-256-cbc'
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
    ```

3. Konačno, pokrenite skriptu iz terminala kako slijedi:

    ```console 
    node cryptor.js
    ```

### Interacting with _Crypto Oracle_ programmatically

Rješavnja izazova zahtjeva veliki broj HTTP zahtjeva (~1000) prema _crypto oracle_ serveru. Stoga preporučamo da ovaj proces automatizirate u nekom programskom jeziku (Python, Java, JavaScript/Node.js, C#, C++,...).

U nastavku ćemo dati neke smjernice i pokazati neke obrasce za Node.js.

#### Slanje HTTP zahtjeva

Koristite [`axios`](https://www.npmjs.com/package/axios) modul za slanje HTTP zahtjeva na server. Instalacija:

```bash
npm install axios
```

##### Primjer 1

```js
const axios = require("axios");

// define async function that returns no data
async function queryCryptoOracle() {
  const response = await axios.post("http://localhost:3000/ecb", { plaintext: "test" });
  console.log(response.data);
}

// call it
queryCryptoOracle();
```

##### Primjer 2 (vrati podatke u _promise_-u)

```js
const axios = require("axios");

//Define an async function that returns data in a promise
async function queryCryptoOracle() {
  try {
    const response = await axios.post("http://localhost:3000/ecb", {
      plaintext: "test"
    });

    return response.data;
  } catch (error) {
    console.error(error.message);
  }
}

// Await data from queryCryptoOracle() function
async function main() {
  const data = await queryCryptoOracle();
  console.log(data);
}

// Call the main function
main();
```

##### Primjer 3 (parametriziraj pozive funkcije)

```js
// Async function with optional arguments; if arguments omitted use the provided default values
async function queryCryptoOracle({
  url = "http://localhost:3000/ecb",
  plaintext = ""
} = {}) {
  try {
    const response = await axios.post(url, {
      plaintext
    });

    return response.data;
  } catch (error) {
    console.error(error.message);
  }
}

// Multiple sequential oracle queries
async function main() {
  let data = await queryCryptoOracle({ plaintext: "test" });
  console.log(data);

  data = await queryCryptoOracle({ plaintext: "xxxxxx" });
  console.log(data);

  data = await queryCryptoOracle({
    url: "http://localhost:3000/ecb",
    plaintext: "test"
  });
  console.log(data);
}

// call the main function
main();
```

#### Manipulacija JS stringovima i JSON objektima

##### Destrukturiranje JSON objekta

```js
const data = {
  ciphertext:
    "61ff4ec0ab0dea6f51ccad918d8a85f26b03de77a0c595011b57ade563ca880d66c636e07094726194bc7375a09ca672"
};

const { ciphertext } = data;
console.log(ciphertext);
```

##### Rezanje (_slicing_) stringova/nizova

```js
const data = {
  ciphertext:
    "61ff4ec0ab0dea6f51ccad918d8a85f26b03de77a0c595011b57ade563ca880d66c636e07094726194bc7375a09ca672"
};

const { ciphertext } = data;

console.log(ciphertext);
// 61ff4ec0ab0dea6f51ccad918d8a85f26b03de77a0c595011b57ade563ca880d66c636e07094726194bc7375a09ca672

console.log(ciphertext.slice(0, 32));
// 61ff4ec0ab0dea6f51ccad918d8a85f2

console.log(ciphertext.slice(0, 50));
// 61ff4ec0ab0dea6f51ccad918d8a85f26b03de77a0c595011b

console.log(ciphertext.slice(2, 5));
// ff4
```
