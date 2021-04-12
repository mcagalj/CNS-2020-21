# **Kriptografija i mrežna sigurnost - Lab 4**

## CBC mode and predictable IVs

_Cipher Block Chaining (CBC)_ **probabilistički** je način enkripcije poruka primjenom blok šifri (npr., AES). Blok šifre rade s blokovima fiksne duljine (npr., AES koristi 128 bitne blokove). Poruke dulje od nominalne duljine bloka zadane šifre enkriptiramo na način da poruku podijelimo/razbijemo na više blokova prije enkripcije.

Kod CBC enkripcijskog moda _plantext_ blokovi se ulančavaju (eng. _chaining_) kako je prikazano na slici u nastavku; prisjetite se, u ECB modu pojedini blokovi enkriptiraju se neovisno.

<p align="center">
<img src="../img/cbc.png" alt="CBC encryption" width="450px" height="auto"/>
<br><br>
<em>Enkripcija u CBC modu</em>
</p>

Uz pretpostavku da se primjenjena blok šifra (npr. AES) ponaša kao **pseudo-random permutacija**, ulančavanjem se postiže _nasumičnost/randomizacija_ šifriranog _plaintext_-a. Uloga _inicijalizacijskog vektora (IV)_ je randomizacija prvog bloka _plaintext_-a. CBC enkripcijski mod osigurava povjerljivost poruka uz određene pretpostavke. Formalno govoreći, CBC mod zadovoljava svojstvo _Indistinguishability under Chosen Plaintext Attack (IND-CPA)_ - napadač ne može razlikovati koja od dvije poruke, po napadačevom izboru, je enkriptirana na osnovu _ciphertext_-a u igri koju smo opisali u okviru predavanja.

Važna pretpostavka za sigurnost CBC moda je **nepredvidivost/nasumičnost inicijalizacijskog vektora**. U nastavku je slikovito prikazana prednost CBC u odnosu na ECB mod; identična slika karakterizirana visokim stupnjem redudancije enkripritana je u ECB i CBC modu (primjenom AES blok šifre).

<p align="center">
<img src="../img/tux.png" alt="ECB vs CBC" width="400px" height="auto"/>
<br>
<em>ECB vs CBC</em>
</p>

### Predictable IV implies insecure CBC

U ovoj vježi pokazat ćemo _ranjivost CBC enkripcijskog moda u slučaju kad nije ispunjena pretpostavka o nepredvidivosti/nasumičnosti inicijalizacijskog vektora (IV)_.

**VAŽNO: Za razliku od prethodne dvije vježbe u okviru ove student treba otkriti odgovarajuću tajnu riječ koja je odabrana nasumično iz javno dostupne liste _wordlist.txt_; student ne dekriptira vic o Chuck Norris-u.**

Kao i kod ECB moda, student će implementirati _chosen-plaintext attack (CPA)_, odnosno slati odgovarajuće _plaintext_-ove _crypto oracle_-u koji će iste enkriptirati u CBC modu i potom vraćati odgovarajući _ciphertext_ natrag studentu. _Crypto oracle_ pri navedenoj enkripciji **bira IV na predvidiv način (ne nasumično)**. Student stoga može predvidjeti IV pod kojim će njen/njegov _plaintext_ biti enkriptiran. Ranjivost opisanog postupka enkripcije proizlazi iz činjnice da student može predvidjeti prvi blok koji se enkriptira, tj., P<sub>1</sub>⊕IV.

Koristeći ovu činjenicu, kao i činjenicu da je enkripcijski algoritam deterministička funkcija, tj., isti _plaintext_ blok rezultirat će istim _ciphertext_ blokom, student može _relativno jednostavno_ testirati potencijalne riječi iz javnog rječnika _wordlist.txt_ slanjem istih _crypto oracle_-u, te usporediti dobivene odgovore s _challenge ciphertext_-om koji _oracle_ također vraća na upit (`GET cbc/iv/challenge`).

### Opis REST API-ja

U ovoj vježbi student će slati sljedeće HTTP zahtjeve svom _crypto oracle_-u:

```Bash
POST /cbc/iv HTTP/1.1
{plaintext: "moj plaintext"}
```

>**VAŽNO:** Server dekodira primljeni _plaintext_ kao _hex_ string. Kao što smo diskutirali, vi ćete testirati različite _plaintext_-ove. Pri tome ćete trebati dodavati _padding_ da bi _plaintext_ proširili do 128 bita, te ga XOR-ati s odgovarajućim inicijalizacijskim vektorima. Pri slanju ovako pripremljenog _plaintext_-a koristite _hex_ enkodiranje jer server očekuje _plaintext_ u formatu _hex_ stringa. Primjer slanja ovako formatiranog _plaintext_-a dan je u nastavku:
```js
const response = await axios.post("http://localhost:3000/cbc/iv", {
  plaintext: "6d6f727475617279080808080808179c"
});

// za hex string reprezentaciju Buffera buff koristite buff.toString('hex')
```

_Crypto oracle_ (vaš REST server) enkriptira vaš _plaintext_ u CBC modu tajnim 256 bitnim ključem (`aes-256-cbc`) i vraća vam odgovarajući _ciphertext_ zajedno s odgovarajućim inicijalizacijskim vektorom (IV). Pri tome, _crpyto oracle_ dodaje potreban _padding_ vašem _plaintext_-u. 

**Ako je vaš _plaintext_ dug 128 bita (16B) kao u primjeru iznad, _oracle_ će dodati cijeli novi 128 bitni blok kao _padding_ vašem 128 bitnom _plaintext_-u. Zbog toga će te dobiti u odgovoru od servera _ciphertext_ dug dva (2) 128 bitna bloka iako je _plaintext_ dug samo jedan (1) 128 bitni blok (vidi primjer u nastavku).**

```js
// Request
const response = await axios.post("http://localhost:3000/cbc/iv", {
  plaintext: "6d6f727475617279080808080808179c"
});

// Response
{
    "iv":"1a2c3c2a9658864a6545174945f59583",
    "ciphertext":"896633eee8bbfbed8447d9b49ce5b595896633eee8bbfbed8447d9b49ce5b595"
}
```

Cilj ove vježbe je otkriti tajnu riječ koja vam je nasumično dodjeljena iz rječnika _wordlist.txt_. Rječnik je javan; možete ga dohvatiti kako slijedi:

```Bash
GET /wordlist.txt HTTP/1.1
```

Osim rječnika, za uspješno rješavanje ovog izazova trebate i odgovarajući _challenge ciphertext_ koji _oracle_ također vraća na upit:

```Bash
# Request
GET /cbc/iv/challenge HTTP/1.1

# Response
{
    "iv":"4a77dd877da00ac6f4f92ceb35e57578",
    "ciphertext":"40c92970bf1ebc8e12b1c450d8c5367b"
}
```

Ovaj _ciphertext_ (_challenge_) i inicijalizacijski vektor (_IV_) rezultat su enkripcije tajne riječi u CBC modu. **Inicijalizacijski vektor (_IV_) za _challenge_ je biran nasumično (_random_), dok se svi ostali _IV_-ovi izvode iz ovog nasumičnog _IV_-a na predvidljiv način ("na koji način" trebate otkriti sami).**

### Kratki savjeti

1. Koristite _primitivna_ sredstva poput olovke i papira te pokušajte sebi skicirati ovaj problem. Napišite matematički izraz za enkripciju u CBC modu.

2. Uvjerite sebe da možete predvidjeti buduće IV. Pogledajte kako je implementirana enkripcija u CBC modu u _crypto oracle_-u (skripta [cbc.controller.js](/crypto-oracle/controllers/cbc.controller.js)). Posebnu pažnju stavite na logiku generiranja inicijalizacijskog vektora (komentirajte s profesorima); što ih čini predvidljivim?

3. Riječi iz rječnika _wordlist.txt_ kraće su od 16 byte-a. Kao takve, _crypto oracle_ dodaje odgovarajući _padding_ neposredno prije njihove enkripcije. _Padding_ je opisan u PKCS#7 standardu:

   ```Bash
   # plaintext size: 1 byte
   plaintext: 00
   w/padding: 00:0f:0f:0f:0f:0f:0f:0f:0f:0f:0f:0f:0f:0f:0f:0f

   # plaintext size: 2 byte
   plaintext: 00:01
   w/padding: 00:01:0e:0e:0e:0e:0e:0e:0e:0e:0e:0e:0e:0e:0e:0e

   # plaintext size: 10 byte
   plaintext: 00:01:02:03:04:05:06:07:08:09
   w/padding: 00:01:02:03:04:05:06:07:08:09:06:06:06:06:06:06

   # plaintext size: 13 byte
   plaintext: 00:01:02:03:04:05:06:07:08:09:0a:0b:0c
   w/padding: 00:01:02:03:04:05:06:07:08:09:0a:0b:0c:03:03:03
   ```

4. **VAŽNO:** Za uspješno rješavanje ove vježbe trebate nekakav mehanizam za manipuliranje binarnim podacima (npr., trebate zbrojiti dva 128-bitna vektora po modulu 2 - `xor` operacija). Također, trebate mehanizam za konverziju stringova u heksadecimalnu reprezentaciju. Node.js definira klasu [Buffer](https://nodejs.org/api/buffer.html) koja vam pojednostavljuje rad s binarnim nizovima podataka, kao i konverziju podataka iz jednog formata u drugi. U nastavku je dano nekoliko primjera:

   ```js
   Buffer.from("Hello world!")
   <Buffer 48 65 6c 6c 6f 20 77 6f 72 6c 64 21>

   Buffer.from("Hello world!").toString('hex')
   '48656c6c6f20776f726c6421'

   Buffer.from("00")
   <Buffer 30 30>

   Buffer.from("00", "hex")
   <Buffer 00>

   Buffer.from("1a2c3c2a9658864a6545174945f59583", "hex")
   <Buffer 1a 2c 3c 2a 96 58 86 4a 65 45 17 49 45 f5 95 83>
   ```

   ```js
   //============================================
   // XOR-ing two 128-bit binary vectors
   //============================================
   const buffer1 = Buffer.from("00000000000000000000000000000001", "hex")
   <Buffer 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 01>

   const buffer2 = Buffer.from("00000000000000000000000000000010", "hex")
   <Buffer 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 10>

   // this buffer (of size 16 bytes) will hold the result
   bufferResult = Buffer.alloc(16)
   <Buffer 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00>

   for (let i = 0; i < buffer1.length; i++) {
     bufferResult[i] = buffer1[i] ^ buffer2[i]
   }

   // print bufferResult
   <Buffer 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 11>
   ```

5. Nekoliko _helper_ funkcija (funkcija za uvećavanje 128-bitnih inicijalizacijskih vektora i funkcija koja implementira PKCS#7 _padding_).

   ```js
   /**
    * Increment a 128-bit integer by the given addend;
    * the max addend is MAX_SAFE_INTEGER in JS, i.e., (2^53 - 1).
    * If addend is not provided it defaults to 1.
    */
   const MAX_32_INTEGER = Math.pow(2, 32) - 1;

   function incrementIv(bigint, addend = 1, offset = 12) {
     // assert(Number.isSafeInteger(addend), "Addend not a safe integer");

     if (offset < 0) return;

     const current = bigint.readUInt32BE(offset);
     const sum = current + addend;

     if (sum <= MAX_32_INTEGER) {
       return bigint.writeUInt32BE(sum, offset);
     }

     const reminder = sum % (MAX_32_INTEGER + 1);
     const carry = Math.floor(sum / MAX_32_INTEGER);

     bigint.writeUInt32BE(reminder, offset);
     incrementIv(bigint, carry, offset - 4);
   }

   //============================================
   // How to use incrementIV()
   //============================================
   const iv = Buffer.from("1889e18a86942219d16d14eeaf50bff4", "hex");
   const before = Buffer.alloc(16);
   iv.copy(before);

   // increment iv by 4
   incrementIv(iv, 4);

   console.log("Before:", before);
   console.log(" After:", iv);
   // Before: <Buffer 18 89 e1 8a 86 94 22 19 d1 6d 14 ee af 50 bf f4>
   //  After: <Buffer 18 89 e1 8a 86 94 22 19 d1 6d 14 ee af 50 bf f8>
   ```

   ```js
   /**
    * Pad the given plaintext according to PKCS#7;
    * please note that this implementation supports
    * only plaintexts of length up to 16 bytes.
    */
   function addPadding(plaintext) {
     // assert(
     //   plaintext.length <= 16,
     //   `Plaintext block exceeds 16 bytes (${plaintext.length})`
     // );

     const pad = 16 - plaintext.length;
     const sourceBuffer = Buffer.from(plaintext);
     const targetBuffer =
       pad > 0 ? Buffer.alloc(16, pad) : Buffer.alloc(32, 16);
     sourceBuffer.copy(targetBuffer, 0, 0);

     return targetBuffer;
   }

   //============================================
   // How to use addPadding()
   //============================================
   addPadding("0");
   // gives 300f0f0f0f0f0f0f0f0f0f0f0f0f0f0f

   addPadding("01");
   // gives 30310e0e0e0e0e0e0e0e0e0e0e0e0e0e

   addPadding("0123");
   // gives 303132330c0c0c0c0c0c0c0c0c0c0c0c

   addPadding("012345678901234");
   // gives 30313233343536373839303132333401

   addPadding("0123456789012345");
   // gives 3031323334353637383930313233343510101010101010101010101010101010
   ```
