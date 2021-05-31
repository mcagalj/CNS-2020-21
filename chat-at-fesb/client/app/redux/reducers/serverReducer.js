import {
    CONNECT,
    CONNECTED
} from '../actions/actionTypes.js'

const initialState = {
    connecting: false,
    connected: false,
    error: null
}

export default (state = initialState, action) => {
    switch (action.type) {
        case CONNECT:
            if (action.error) {
                return {
                    ...state,
                    connected: false,
                    connecting: false,
                    error: action.payload
                } 
            }

            return {
                ...state, 
                connected: false,
                connecting: true
            }

        case CONNECTED:
            return {
                ...state,
                connected: true,
                connecting: false
            }    

        default:
            return state
    }
}