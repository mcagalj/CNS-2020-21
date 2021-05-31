import reducer from './reducers/root.js'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { logger } from 'redux-logger'
import serverAPIMiddleware from 'app/redux/middleware/serverAPIMiddleware.js'

/* 
 * A blueprint of the app state 
 */
// const initState = {
//     server: {
//         connecting: false,
//         connected: false,
//         error: null        
//     },

//     client: {
//         nickname: null,
//         id: null
//     },

//     clients: {},
//     messages: [],
//     credentials: {},
//
//     ui: {
//         [id]: {
//              face: null
//              color: null
//          }
//     }
// }

const store = createStore(
    reducer, 
    undefined,
    applyMiddleware(
        thunk,
        logger,
        serverAPIMiddleware
    )
)

export default store