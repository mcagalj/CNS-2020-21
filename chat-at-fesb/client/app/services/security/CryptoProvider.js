const crypto = require('crypto')
const PBKDF2 = require('./pbkdf2')
const ECB = require('./ciphers').ecb
const CBC = require('./ciphers').cbc
const CTR = require('./ciphers').ctr
const GCM = require('./ciphers').gcm

const Key = { PBKDF2 }
const Cipher = { 
    ECB: ECB.encrypt, 
    CBC: CBC.encrypt, 
    CTR: CTR.encrypt,
    GCM: GCM.encrypt
}

const Decipher = { 
    ECB: ECB.decrypt, 
    CBC: CBC.decrypt,
    CTR: CTR.decrypt,
    GCM: GCM.decrypt
}

class CryptoProvider {
    static generateKey(type, params) {
        if (!Key.hasOwnProperty(type)) throw Error(`Wrong key generator type ${type}`)
        return Key[type](params)
    }

    static encrypt(type, params) {
        if (!Cipher.hasOwnProperty(type)) throw Error(`Wrong cipher/mode ${type}`)
        return Cipher[type](params)
    }

    static decrypt(type, params) {
        if (!Decipher.hasOwnProperty(type)) throw Error(`Wrong cipher/mode ${type}`)
        return Decipher[type](params)
    }
}

module.exports = CryptoProvider