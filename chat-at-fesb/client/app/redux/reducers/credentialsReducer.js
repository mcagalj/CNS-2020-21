import { Constants } from 'config'
import { 
    KEY_GENERATE,
    KEY_GENERATED,
    KEY_DELETE,
    MSG_IN,
    MSG_OUT
} from '../actions/actionTypes.js'

const { MsgType } = Constants

const initialState = {
    symmetric: { key: null, isGenerating: false },
    asymmetric: null
}

export default (state = {}, action) => {
    switch (action.type) {
        case KEY_GENERATE:
        case KEY_GENERATED:
        case KEY_DELETE: {
            const { id } = action.payload
            let symmetric = undefined
            let asymmetric = undefined
            if (id in state) {
                symmetric = state[id].symmetric
                asymmetric = state[id].asymmetric
            }
            return {
                ...state,
                [id]: {
                    symmetric: symmetricReducer(symmetric, action),
                    asymmetric: asymmetricReducer(asymmetric, action)
                }
            }
        }

        case MSG_IN:
            return msgInReducer(state, action)

        default:
            return state
    }
}


/*
 * This reducer handles symmetric part of the credentials store. 
 */
function symmetricReducer(state=initialState.symmetric, action) {
    switch (action.type) {
        case KEY_GENERATE:
            if (action.error) {
                return {
                    ...state.key,
                    isGenerating: false
                }
            }

            return {
                ...state.key,
                isGenerating: true  
            }

        case KEY_GENERATED:
            return {
                key: action.payload.key,
                isGenerating: false
            }

        case KEY_DELETE:
            return {
                ...state,
                key: null
            }

        default:
            return state
    }
}

/*
 * This reducer handles asymmetric part of the credentials store.
 * Not used at the moment.
 */
function asymmetricReducer(state=initialState.asymmetric, action) {
    switch (action.type) {
        default:
            return state
    }
}


function msgInReducer(state={}, action) {
    const { type, id } = action.payload
    
    switch (type) {
        case MsgType.CLIENT_LEFT:
            if (id in state) {
                let _state = {...state}
                delete _state[id]
                return _state                
            }

        default:
            return state
    }    
}
