import net from 'net'
import { JSONparse, JSONstringify } from 'app/utils/safeJSON.js'

class ServerAPI {

    connect(params = {}) {
        const { host, port, msg } = params

        return new Promise((resolve, reject) => {      

            if (!ServerAPI.validateNumber(port, 0, 65535)) { 
                reject(new RangeError(
                    `"port" option should be in range [0, 65535]:  ${port}`
                ))
            }

            this.socket = net.connect({
                port: port,
                host: host 
           
            }).once('connect', () => {
                if (msg) this.send(msg)

            }).once('data', data => {
                resolve(JSONparse(data))

            }).once('error', err => {
                if (this.socket) this.socket.destroy()
                reject(err)
            })
        })
    }

    send(data) {
        return new Promise((resolve, reject) => {
            if (this.socket) {
                this.socket.write(JSONstringify(data))
            }                
            resolve()
        })
    }

    static validateNumber(number, min, max) {      
        return number >= min && number <= max
    }    
}

const serverAPI = new ServerAPI

export default serverAPI