const fs = require('fs')
const path = require('path')
const readline = require('readline')
const debug = require('debug')('wordlist')

const wordlist = 'wordlist.txt'
let chosenword = null

const file = path.join(__dirname, wordlist)
const fileStream = fs.createReadStream(file, { encoding: 'utf8' })
const rl = readline.createInterface({ input: fileStream })

const getRandomWord = ({ wordcount=0, separator=' ' }) => {
    let linecount = 0
    const randomIndex = Math.floor(Math.random() * wordcount)
    
    return new Promise( resolve => {
        rl.on('line', line => {
            const word = line.trim()
            if (!word) {
                rl.close()
                return debug(`[-] Missing/empty word at line ${linecount}`)
            }
            
            if ((linecount++) === randomIndex) { 
                chosenword = word
                rl.close()
            }
        }).on('close', () => {
            resolve(chosenword)
        })
    })
}

module.exports = getRandomWord