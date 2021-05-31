/*
 * This middleware processes outgoing/incoming messages.
 * As an alternative we can use redux-thunk (see serverActions.js)
 */
import { CONNECT, MSG_OUT, MSG_IN } from "../actions/actionTypes.js";

import {
  handleConnect,
  handleMsgOut,
  handleMsgIn
} from "./serverHandlers/index";

export default store => next => action => {
  if (typeof actionHandlers[action.type] === "function") {
    return actionHandlers[action.type](store, next, action);
  }
  return next(action);
};

const actionHandlers = {
  [CONNECT]: handleConnect,
  [MSG_OUT]: handleMsgOut,
  [MSG_IN]: handleMsgIn
};
