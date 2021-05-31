const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");

let window;

app.on("ready", () => {
  createMainWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (window === null) {
    createMainWindow();
  }
});

function createMainWindow() {
  const options = {
    width: 800,
    height: 800,
    frame: true,
    show: false,
    fullscreen: false,
    backgroundColor: "#000000",
    webPreferences: {
      nodeIntegration: true
    }
  };

  window = new BrowserWindow(options);

  window.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true
    })
  );

  window.once("ready-to-show", () => {
    window.show();
  });

  window.on("closed", () => {
    window = null;
  });
}
