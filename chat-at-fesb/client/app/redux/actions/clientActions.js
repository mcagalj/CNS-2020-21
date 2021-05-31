import { 
    MSG_OUT,
    CLIENT_ERROR
} from './actionTypes.js'

export const sendMsg = msg => ({
    type: MSG_OUT,
    payload: msg,
    meta: { wrapped: false }
})

export const msgSent = msg => ({
    type: MSG_OUT,
    payload: msg,
    meta: { wrapped: true }
})

export const clientError = error => ({
    type: CLIENT_ERROR,
    payload: error
})
