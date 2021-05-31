import { 
    CONNECTED,
    MSG_IN
} from '../actions/actionTypes.js'
import { Constants } from 'config'
const { MsgType } = Constants


export default (state = {}, action) => {
    switch (action.type) {
        case CONNECTED:
            const { clients } = action.payload.msg            
            return {...state, ...clients}

        case MSG_IN:
            const { type } = action.payload

            if (type === MsgType.CLIENT_JOINED) {
                const { id, nickname } = action.payload                
                return {...state, [id]: nickname}             
            }

            if (type === MsgType.CLIENT_LEFT) {
                const { id } = action.payload
                let _state = {...state}
                delete _state[id]
                return _state
            }

            return state
            
        default:
            return state
    }
}