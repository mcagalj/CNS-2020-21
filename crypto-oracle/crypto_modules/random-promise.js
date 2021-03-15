const crypto = require('crypto')

exports = module.exports = (size=16) => {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(size, (err, buf) => {
                (err) ? ( 
                    reject(Error(`Failed to generate random bytes; error: ${err}`))
                ) : (
                    resolve(buf)                        
                )}
        );
    })    
}