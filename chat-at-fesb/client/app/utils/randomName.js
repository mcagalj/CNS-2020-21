import crypto from 'crypto'

function hex2alphabet(inputHex, length) {
    const usernameLength = length
    let hex = inputHex.toString(),
        str = '',
        dec = 0
    for (let i = 0; i < hex.length; i += 2) {
        dec = parseInt(hex.substr(i, 2), 16) % 25
        if (dec >= 10 && dec <= 25) {
            dec += 55
            str += String.fromCharCode(dec)
            if (str.length >= usernameLength) break
        }
    }
    return str        
}

function hash(input) {
    return crypto.createHash('sha1').update(input).digest('hex');    
}

function randomName(length = 6) {
    const time = new Date().getTime().toString();
    return hex2alphabet(hash(time), length)
}

export default randomName