import { combineReducers } from "redux";
import serverReducer from "./serverReducer.js";
import clientReducer from "./clientReducer.js";
import clientsReducer from "./clientsReducer";
import messagesReducer from "./messagesReducer";
import credentialsReducer from "./credentialsReducer";
import uiReducer from "./uiReducer";
import { CONNECT } from "../actions/actionTypes.js";

const appReducer = combineReducers({
  server: serverReducer,
  client: clientReducer,
  clients: clientsReducer,
  messages: messagesReducer,
  credentials: credentialsReducer,
  ui: uiReducer
});

const rootReducer = (state, action) => {
  if (action.type === CONNECT && action.error) {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
