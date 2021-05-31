const crypto = require('crypto')

const DEFAULTS = {
    iterations: 300000,
    size: 32,
    hash: 'sha512'
}

exports = module.exports = ({
    secret, 
    salt, 
    iterations, 
    size, 
    hash 
} = DEFAULTS ) => { 

    iterations = +iterations
    size = +size
    salt = salt ? salt : DEFAULTS.salt       
    iterations = iterations > 0 ? iterations : DEFAULTS.iterations
    size = size > 0 ? size : DEFAULTS.size
    hash = crypto.getHashes().includes(hash) ? hash : DEFAULTS.hash

    return new Promise((resolve, reject) => {
        crypto.pbkdf2(secret, salt, iterations, size, hash, (err, key) =>
            err ? ( 
                reject(Error(`Failed to generate a key with error: ${err}`))
            ) : (
                resolve(key)                        
            )
        )
    })
}