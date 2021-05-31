import { Constants } from 'config'
import { 
    CONNECTED,
    MSG_IN,
    MSG_OUT
} from '../actions/actionTypes.js'

const { MsgType } = Constants

export default (state = [], action) => {
    switch (action.type) {
        case CONNECTED:
            return state.concat(action.payload.msg)

        case MSG_IN:
        case MSG_OUT:
            const { type } = action.payload
            if (
                type !== MsgType.UNICAST && 
                type !== MsgType.BROADCAST
            ) return state

            return state.concat(action.payload)
        
        default:
            return state
    }
}