import { CONNECTED } from '../actions/actionTypes.js'

const initialState = {
    nickname: null,
    id: null,
}

export default (state = initialState, action) => {
    switch (action.type) {
        case CONNECTED:
            const { nickname, msg: {id, } } = action.payload          
            return {...state, nickname, id}

        default:
            return state
    }
}