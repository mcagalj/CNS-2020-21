// import serverAPI from 'app/services/server-api/ServerAPI.js'
import { CONNECT, CONNECTED, MSG_IN } from "./actionTypes.js";

/*
 * This example shows how to handle async actions using redux-thunk.
 * Alternatively, we can handle calls to async actions by implementing
 * a redux middleware.
 */
// export const serverConnect = params => dispatch => {
//     dispatch({type: CONNECT})
//     return (
//         serverAPI
//             .connect(params)
//             .then(res => dispatch(serverConnected(res, params)))
//             .catch(err => dispatch(serverError(err)))
//     )
// }

export const serverConnect = params => ({
  type: CONNECT,
  payload: params
});

export const serverError = error => ({
  type: CONNECT,
  payload: error,
  error: true
});

export const serverConnected = (msg, nickname) => ({
  type: CONNECTED,
  payload: { nickname, msg }
});

export const serverMsg = (msg, { serialized = false } = {}) => ({
  type: MSG_IN,
  payload: msg,

  // Raw messages should be de-serialized
  // before passing them on to reducers.
  // This meta tag signals the serverAPI
  // middleware to de-serialize a msg first.
  meta: { serialized }
});
