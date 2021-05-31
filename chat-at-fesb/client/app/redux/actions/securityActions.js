import { KEY_GENERATE, KEY_GENERATED, KEY_DELETE } from "./actionTypes.js";

export const generateKey = (payload) => (dispatch) => {
  dispatch({
    type: KEY_GENERATE,
    payload: { id: payload.id },
  });

  // Here we simulate a call to a "slow" hash function
  // (e.g., scrypt, PBKDF2, etc.). The purpose of the
  // slow function is to securely generate an encryption
  // key based on password.
  // Your task is to replace this part with a true
  // "slow" hash function. See instructions below.
  setTimeout(
    () =>
      dispatch({
        type: KEY_GENERATED,
        payload: {
          id: payload.id,
          key: payload.secret,
        },
      }),
    1000
  );

  //===================================================
  // Replace the above with a true slow hash function
  // (e.g., PBKDF2). You can make use of a simple
  // wrapper function defined in CryptoProvider.js
  // for this task (app/services/security/CryptoProvider.js).
  // Do not forget to import (require) this file.
  //
  //   CryptoProvider.generateKey("PBKDF2", {
  //     secret: payload.secret,
  //     salt: payload.id
  //   })
  //     .then(key =>
  //       dispatch({
  //         type: KEY_GENERATED,
  //         payload: { id: payload.id, key }
  //       })
  //     )
  //     .catch(error =>
  //       dispatch({
  //         type: KEY_GENERATE,
  //         payload: { id: payload.id, error },
  //         error: true
  //       })
  //     );
  //===================================================
};

export const deleteKey = (id) => ({
  type: KEY_DELETE,
  payload: { id },
});
