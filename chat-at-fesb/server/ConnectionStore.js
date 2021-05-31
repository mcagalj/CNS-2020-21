// @ts-check
const { log } = require("./utils.js");
const stringify = require("json-stringify-safe");

//---------------------------------------------------
// A store for keeping track of connected clients
//---------------------------------------------------
class ConnectionStore {
  constructor({ host, port }) {
    this.id = ConnectionStore.uid(host, port);
    this.nicknames = { [this.id]: "Server" };
  }

  /**
   * Add a new client/connection to the list of connected clients.
   *
   * @param {*} socket
   * @param {*} nickname
   */
  append(socket, nickname = "") {
    const { remoteAddress: address, remotePort: port } = socket;
    const id = ConnectionStore.uid(address, port);
    socket.id = id;
    this.connections = { ...this.connections, [id]: socket };
    this.nicknames = { ...this.nicknames, [id]: nickname };
    return id;
  }

  /**
   * Check if the given client is already registered.
   * To be able to receive or send messages a client
   * must register a nickname with the server.
   *
   * @param {*} id
   */
  isRegistered(id) {
    return this.nicknames[id] ? true : false;
  }

  /**
   * Client registration; register the nickname
   * with the given uid.
   *
   * @param {*} id
   * @param {*} nickname
   */
  register(id, nickname) {
    if (!(id in this.nicknames)) {
      return log.error(
        null,
        `Failed to set nickname "${nickname}". Non-existing client [${id}].`
      );
    }
    this.nicknames = { ...this.nicknames, [id]: nickname };
  }

  /**
   * Return an object comprising all the clients (their nicknames
   * indexed by unique ids) excluding the one provided as an
   * argument.
   *
   * @param {*} id
   */
  without(id) {
    const others = { ...this.nicknames };
    delete others[this.id];
    delete others[id];
    return others;
  }

  /**
   * Remove the given client from the list of clients.
   *
   * @param {*} id
   */
  delete(id) {
    let deleted = false;
    if (id in this.connections) {
      log.important(`Deleting client "${this.nicknames[id]}" [${id}]`);
      const _connections = { ...this.connections };
      delete _connections[id];
      this.connections = _connections;
      deleted = true;
    }

    if (id !== this.id && id in this.nicknames) {
      const _nicknames = { ...this.nicknames };
      delete _nicknames[id];
      this.nicknames = _nicknames;
      deleted = true;
    }

    return deleted;
  }

  /**
   * Send a message (data) to the given receiver. Only
   * registered clients are allowed to send messages to
   * already registered receivers.
   *
   * There is one exception to this rule: the server
   * itself is allowed to send messages to clients that
   * are not yet registered.
   *
   * @param {*} sender
   * @param {*} receiver
   * @param {*} data
   */
  send(sender, receiver, data) {
    if (sender !== this.id) {
      if (!this.nicknames[sender]) {
        return log.error(null, `Sender does not exist [${sender}]`);
      }

      if (!(receiver in this.nicknames)) {
        return log.error(null, `Unknown receiver [${receiver}]`);
      }

      if (!this.nicknames[receiver]) {
        return log.error(null, `Receiver not registered [${receiver}]`);
      }
    }

    if (!this.connections[receiver]) {
      return log.error(null, `Unknown receiver [${receiver}]`);
    }

    const _sender = `"${this.nicknames[sender]}" [${sender}]`;
    const _receiver = `"${this.nicknames[receiver]}" [${receiver}]`;
    log.important(`Sending: ${data}`);
    log.info(`${_sender} ==> ${_receiver}`);

    try {
      this.connections[receiver].write(data);
    } catch (error) {
      log.error(error, "Failed to send data");
    }
  }

  /**
   * The given client broadcasts the given message to
   * other registered clients.
   *
   * @param {*} id
   * @param {*} data
   */
  broadcast(id, data) {
    Object.keys(this.connections).forEach(key => {
      if (key !== id) {
        this.send(id, key, data);
      }
    });
  }

  /**
   * Getter for the server uid.
   */
  get serverId() {
    return this.id;
  }

  /**
   * A static method used to generate unique
   * identifiers for clients.
   *
   * @param {*} ip
   * @param {*} port
   */
  static uid(ip, port) {
    return require("crypto")
      .createHash("sha256")
      .update(ip.toString())
      .update(port.toString())
      .digest("hex")
      .substring(0, 40);
  }

  /**
   * A simple printing utility displaying
   * currently connected clients.
   */
  print() {
    try {
      log.important("Connected clients:");
      log.info(stringify(this.without(this.id), null, 2));
    } catch (error) {
      log.error(error, `Failed to print connected clients`);
    }
  }
}

module.exports = ConnectionStore;
