// @ts-check
const config = require("config");
const { MsgType } = config.get("Constants");
const { JSONparse, JSONstringify, log } = require("./utils.js");

const { SERVER_MODE = undefined } = process.env;

//---------------------------------------------------
// Handlers for a client connection
//---------------------------------------------------
class ConnectionHandler {
  constructor(server, socket) {
    this.server = server;
    this.socket = socket;
    this.remoteClient = `${socket.remoteAddress}:${socket.remotePort}`;
  }

  /**
   * Listener and handler for data received over the given socket.
   * The handler is activated when a socket emits a `data` event.
   *
   * @param {*} data
   */
  handleData(data) {
    const server = this.server;
    const { id } = this.socket;

    log.info(`New message ${data} [${this.remoteClient}]`);

    const msg = JSONparse(data);

    // Tamper with a random message is this mode is set
    if (SERVER_MODE === "COMPROMISE_INTEGRITY") {
      // Compromise a message with prob = 0.3
      const rand = Math.floor(Math.random() * 100);
      if (rand < 30 && msg.content) {
        const index = Math.floor(Math.random() * msg.content.length);
        let tmp = msg.content.slice(0, index);
        tmp += msg.content.slice(index + 1);
        msg.content = tmp.slice(0);
      }
      data = JSONstringify(msg);
    }

    if (Object.is(msg, undefined)) {
      return log.error(
        null,
        `Expecting a JSON serialized message [${this.remoteClient}]`
      );
    }

    // Client registered, pass its message through.
    if (server.isRegistered(id)) {
      switch (msg.type) {
        case MsgType.UNICAST:
        case MsgType.KEY_AGREEMENT:
          return server.send(id, msg.to, data);

        case MsgType.BROADCAST:
          return server.broadcast(id, data);

        default:
          return log.error(
            null,
            `Unknown, missing or wrong message type ${data} [${
              this.remoteClient
            }]`
          );
      }
    }

    // Client not registered with the server.
    const { type = undefined, nickname = undefined } = msg;
    if (!Object.is(type, MsgType.INIT) || Object.is(nickname, undefined)) {
      return log.error(
        null,
        `Client registration failed: ${data} [${this.remoteClient}]`
      );
    }

    server.register(id, nickname);

    data = JSONstringify({
      type: MsgType.CLIENT_JOINED,
      id: id,
      nickname: nickname
    });

    if (Object.is(data, undefined)) {
      return log.error(
        null,
        `Client failed joining: ${data} [${this.remoteClient}]`
      );
    }

    server.broadcast(id, data);
    server.print();
  }

  /**
   * Listener for `error` events emitted by a socket.
   *
   * @param {*} error
   */
  handleError(error) {
    log.error(error, `Socket error [${this.remoteClient}]`);
    this.handleEnd();
  }

  /**
   * Listener for `close` events emitted by a socket.
   */
  handleClose() {
    log.important(
      `Closing a socket with ${this.remoteClient} [${this.socket.id}]`
    );
    this.handleEnd();
  }

  /**
   * Listener for `end` events emitted by a socket.
   */
  handleEnd() {
    const server = this.server;
    const { id } = this.socket;

    // Query for the nickname before deleting the client.
    const registered = server.isRegistered(id);
    const deleted = server.delete(id);
    server.print();
    if (!registered || !deleted) {
      return;
    }

    this.socket.destroy();

    const msg = JSONstringify({
      type: MsgType.CLIENT_LEFT,
      id: id
    });

    if (Object.is(msg, undefined)) {
      return log.error(
        null,
        `Client failed leaving: ${msg} [${this.remoteClient}]`
      );
    }

    server.broadcast(server.serverId, msg);
  }
}

module.exports = ConnectionHandler;
