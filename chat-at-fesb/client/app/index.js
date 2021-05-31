import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "app/containers/App.jsx";
import store from "app/redux/store.js";
import styles from "app/scss/main.scss";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("main")
);
