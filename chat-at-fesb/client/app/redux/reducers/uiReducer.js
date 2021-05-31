import { 
    CONNECTED,
    MSG_IN
} from '../actions/actionTypes.js'
import { Constants } from 'config'
const { MsgType } = Constants

const colorPalette = [
    '#40407a',
    '#2c2c54',
    '#34ace0',
    '#33d9b2',
    '#034ED0',
    '#b33939',
    '#cd6133',
    '#706fd3',
    '#ff5252',
    '#546de5',
    '#f78fb3',
    '#e15f41',
    '#079992',
    '#82ccdd',
    '#fd79a8',
    '#a29bfe',
    '#00b894',
    '#22a6b3'
]

const pickColor = () => colorPalette[Math.floor(Math.random() * colorPalette.length)]

export default (state = {}, action) => {
    switch (action.type) {
        case CONNECTED:
            const { clients } = action.payload.msg
            const ui = {...clients}
            Object.keys(ui).forEach(key => ui[key] = {
                face: null,
                color: pickColor()
            })            
            
            return {
                ...state, 
                ...ui
            }

        case MSG_IN:
            const { type } = action.payload

            if (type === MsgType.CLIENT_JOINED) {
                const { id, nickname } = action.payload                
                return {
                    ...state, 
                    [id]: {
                        face: null,
                        color: pickColor()
                    }
                }             
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