# **Kriptografija i mrežna sigurnost - Lab 5**

## CTR mode and repeated IVs

CTR mod enkriptira _plaintext_ jednostavnom _xor_ operacijom s generiranim _pseudo-slučajnim_ nizom ključeva.
CTR mod generira _pseudo-slučajan_ niz ključeva (_key stream_) na način da enkriptira slijedne vrijednosti brojača (_counter_) kako je prikazano na priloženoj slici.

<p align="center">
<img src="../img/ctr.png" alt="CTR encryption" width="450px" height="auto"/>
<br><br>
<em>Enkripcija u CTR modu</em>
</p>

CTR mod siguran je način enkripcije (osigurava povjerljivost podataka) ali uz važan preduvjet: **isti brojač (_counter_) ne smije se ponoviti (enkriptirati više puta) pod istim enkripcijskim ključem _K_**. U slučaju ponavljanja istog brojača (pod istim ključem K), moguće je dekriptirati _ciphertext_ bez poznavanja enkripcijskog ključa _K_. Ovu ranjivost smo diskutirali u kontekstu Vernamove šifre, a u praksi smo joj svjedočili u kontekstu WiFi mreža i WEP protokola.

### Repeated counters

U ovoj vježi pokazat ćemo ranjivost CTR enkripcijskog moda u slučaju kad nije ispunjena pretpostavka o neponavljanju brojača (_counter_-a). Kao i kod CBC moda, student će implementirati _chosen-plaintext attack (CPA)_, odnosno slati upite (tj. _plaintext_) _crypto oracle_-u koji će iste enkriptirati u CTR modu i potom vraćati enkriptirani _ciphertext_ natrag studentu.

Ranjivost _crypto oracle_ u ovoj vježbi proizlazi iz činjenice da se **brojač bira (nasumično) iz vrlog ograničenog/malog skupa brojeva**. Posljedica opisanog načina generiranja brojača za CTR mod je ta da će se nakon određenog broja enkripcija brojač ponaviti što napadaču omogućuje dekripciju _ciphertext_-a bez poznavanja enkripcijskog ključa. Prosječan broj poruka koje treba enkriptirati prije ponavljanja brojača student može procjeniti uvidom u skriptu [crypto-oracle/controllers/ctr.controller.js](/crypto-oracle/controllers/ctr.controller.js).

Zadatak studenta je iskoristiti gore opisani propust u _crypto oracle_-u i dekriptirati vic o Chuck Norris-u koji je ovaj put enkriptiran u CTR modu s istim enkripcijskim ključem kao i poslani studentovi _plaintext_-ovi. **U osnovi, nakon što student pošalje dovoljan broj poruka serveru na enkripciju u CTR modu, jedna od poruka biti će enkriptirana s istim _counter_-om kao i vic o Chuck Norris-u.**

### Opis REST API-ja

Student šalje sljedeće HTTP zahtjeve _crypto oracle_-u:

```Bash
POST /ctr HTTP/1.1
plaintext = 'b5cadfsd'
```

**VAŽNO**: _Plaintext_ treba biti enkodiran kao `hex` string.

_Crypto oracle_ (vaš REST server) uzima vaš _plaintext_ enkriptira ga u CTR modu tajnim 256 bitnim ključem (`aes-256-ctr`) i vraća vam odgovarajući _ciphertext_; primjetite, _oracle_ ne vraća odgovarajući brojač odnosno inicijalizacijski vektor kako je to bio slučaj s CBC modom.

```Bash
{
    "ciphertext":"ea1331f1"
}
```

Odgovarajući _challenge ciphertext_ (enkriptirani vic) možete dobiti slanjem HTTP upita:

```Bash
# Request
GET /ctr/challenge HTTP/1.1

# Response
{
    "ciphertext":"f4483ef1443c1f24e26b8c697875004d26a3cfdfc76e1b34fb78facc97009f2bb599a5a97addc444409b4ea38d"
}
```
