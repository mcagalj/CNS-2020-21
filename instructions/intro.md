# **Kriptografija i mrežna sigurnost**

## Lokalno pokretanje  _crypto oracle_ servera

> Pripremio: **Mateo Fuzul (generacija 2019/20)**

U nastavku su kratke upute za pokretanje _crypto oracle_ REST servera na lokalnom računalu.

1. Klonirajte ovaj repozitorij na lokalno računalo kako slijedi:

   ```console
    git clone https://github.com/mcagalj/CNS-2020-21.git
   ```

2. Uđite u direktorij projekta `crypto-oracle/`:

    ```console
    cd CNS-2019-20/crypto-oracle/
    ```

3. Unutar navedenog direktorija nalazi se datoteka `package.json` u kojoj se nalazi popis modula/skripti potrebnih za pokretanje servera. Kako bi instalirali potrebne module u konzoli/terminalu izvršite naredbu:

   ```console
   npm install
   ```

4. Nakon što su svi moduli instalirani, REST server pokreće se naredbom:

   ```console
   npm start
   ```

   Ovu naredbu  izvršavate u istom direktoriju u kojem se nalazi i datoteka `package.json`. Serveru se može pristupiti unutar browsera na adresi `localhost:3000`.

5. Parametri koje server koristi za genriranje kriptografskih izazova (vicevi, _cookie_-ji, tajne riječi, javni i privatni ključevi, i sl.) definirani su u datoteci `.env`.

6. Drugi konfiguracijski parametri važni za pokretanje servera (npr., port) definirani su u datoteci `config\config.js`. 
    > VAŽNO: U slučaju da vam je predefinirani port 3000 zauzet na lokalnom računalu, u ovoj konfiguracijskoj datoteci možete definirati neki drugi slobodni port (npr. 3001, 8000 i sl.).

