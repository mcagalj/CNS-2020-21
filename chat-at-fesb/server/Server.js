"use strict";

const config = require("config");
const net = require("net");

const { JSONstringify, log } = require("./utils.js");
const ConnectionStore = require("./ConnectionStore.js");
const ConnectionHandler = require("./ConnectionHandler.js");
const { banner } = config.get("Server");
const { MsgType } = config.get("Constants");

class Server extends ConnectionStore {
  constructor({ host = "localhost", port = 6968 }) {
    super({ host, port });
    this.port = port;
    this.host = host;
    this.server = net.createServer();
    this.handleConnection = this.handleConnection.bind(this);
    this.handleServerError = this.handleServerError.bind(this);
    this.start();
  }

  start() {
    this.server
      .on("connection", this.handleConnection)
      .on("error", this.handleServerError)
      .listen(this.port, this.host, () => {
        if (typeof this.server.address() === "object") {
          const { address, port } = this.server.address();
          this.address = `${address}:${port}`;
        } else {
          this.address = this.server.address();
        }

        log.info(`Server started at: ${this.address}`);
      });
  }

  /**
   * Initial connection handler/listener. Activated
   * when the server emits a 'connection' event.
   *
   * @param {*} socket
   */
  handleConnection(socket) {
    log.important(`Join request from ${this.address}`);

    const id = this.append(socket);

    const msg = JSONstringify({
      type: MsgType.INIT,
      timestamp: Date.now(),
      banner: banner,
      id: id,
      clients: this.without(id)
    });

    this.send(this.serverId, id, msg);
    log.emph(`New client ${id} [${this.address}]`);
    this.print();

    const connectionHandler = new ConnectionHandler(this, socket);
    socket.on("data", data => connectionHandler.handleData(data));
    socket.on("error", error => connectionHandler.handleError(error));
    socket.on("end", () => connectionHandler.handleEnd());
    socket.on("close", () => connectionHandler.handleClose());
  }

  /**
   * Listener for server 'error' events.
   *
   * @param {*} error
   */
  handleServerError(error) {
    log.error(error, `Server error [${this.address}]`);
  }
}

module.exports = Server;
