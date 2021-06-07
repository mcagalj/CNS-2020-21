define((require) => {
  const SocketIO = require("socket.io");
  const Chart = require("chart");
  const ErrorModal = require("error.modal");
  const config = require("config");

  let io;

  // Just a syntactic sugar; Require.js immediately executes
  // a module when using require(); so we could go without
  // actually wrapping the IO logic in the init function.
  function init() {
    io = SocketIO.connect(location.origin);

    ["init", "data"].forEach((event) => {
      io.on(event, (series) => {
        console.log("SocketIO", event, series);
        try {
          Chart.update({
            event: event,
            data: series,
          });
        } catch (err) {
          console.log(`Error on "${event}" event:`, err);
          ErrorModal.show({
            title: config.ERROR_TEXT.IO_EVENT.title,
            message: err.message,
          });
        }
      });
    });

    // Reset chart
    io.on("reset", () => Chart.reset());

    // Websocket connection with the server established
    io.on("disconnect", () => {
      console.log(`SocketIO client disconnected`);
    });

    // Handle io errors
    io.on("error", (err) => {
      console.log(`Socket.io error`, err);
      ErrorModal.show({
        title: config.ERROR_TEXT.IO_ERROR.title,
        message: err.message,
      });
    });
  }

  return {
    init: () =>
      new Promise((resolve, reject) => {
        init();

        // Websocket connection with the server established
        io.on("connect", () => {
          console.log(`SocketIO client connected`);
          resolve();
        });
      }),
  };
});
