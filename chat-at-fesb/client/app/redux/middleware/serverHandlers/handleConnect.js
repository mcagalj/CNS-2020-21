import { Server, Constants } from "config";
import serverAPI from "app/services/server-api/ServerAPI.js";
import randomName from "app/utils/randomName.js";
import {
  serverConnected,
  serverError,
  serverMsg
} from "app/redux/actions/serverActions.js";

const { MsgType } = Constants;

export default ({ dispatch }, next, action) => {
  if (action.error) return next(action);

  const {
    host = "localhost",
    port = Server.port,
    nickname = randomName()
  } = action.payload;

  const msg = { type: MsgType.INIT, nickname };

  serverAPI
    .connect({ host, port, msg })
    .then(res => dispatch(serverConnected(res, nickname)))
    .then(() => {
      const { socket } = serverAPI;
      socket.on("data", data =>
        dispatch(serverMsg(data, { serialized: true }))
      );
      socket.on("error", error => dispatch(serverError(error)));
    })
    .catch(err => dispatch(serverError(err)));

  return next(action);
};
