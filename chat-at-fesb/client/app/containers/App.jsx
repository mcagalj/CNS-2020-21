import React from "react";
import { connect } from "react-redux";
import IntroScreen from "app/containers/screens/IntroScreen/IntroScreen.jsx";
import MainScreen from "app/containers/screens/MainScreen/MainScreen.jsx";

const App = ({ connected }) => {
  return connected ? <MainScreen /> : <IntroScreen />;
};

const mapStateToProps = ({ server: { connected } }) => ({ connected });
const AppContainer = connect(mapStateToProps)(App);

export default AppContainer;
