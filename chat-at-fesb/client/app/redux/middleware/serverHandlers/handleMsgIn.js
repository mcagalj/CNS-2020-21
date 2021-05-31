import { serverMsg } from "app/redux/actions/serverActions.js";
import { JSONparse } from "app/utils/safeJSON.js";
import { clientError } from "app/redux/actions/clientActions.js";
import { loadKey } from "./utils.js";

export default ({ getState, dispatch }, next, action) => {
  const {
    meta: { serialized }
  } = action;
  if (!serialized) return next(action);

  let msg = JSONparse(action.payload);

  if (Object.is(msg, undefined)) {
    return dispatch(clientError(`JSON.parse error: ${data}`));
  }

  if (msg.id) {
    const { credentials } = getState();

    //===================================================
    // Try to load an encryption key for this client id;
    // please note that this is a remote client.
    //===================================================
    const key = loadKey(msg.id, credentials);

    //===================================================
    // If the encryption key is successfully loaded,
    // it is implied that all incoming messages from this
    // remote client will be encrypted with that key.
    // So, we decrypt the messages before reading them.
    //===================================================
    if (key) {
      msg = { ...msg };
      msg.content = `DECRYPTED(${msg.content})`;
    }
  }

  dispatch(serverMsg(msg));
};
