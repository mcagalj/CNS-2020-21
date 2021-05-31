import React from "react";
import { connect } from "react-redux";
import Tabs, { Tab } from "app/components/Tabs/Tabs.jsx";
import Header from "app/components/Header/Header.jsx";
import ConnectedUsers from "app/containers/ConnectedUsers/ConnectedUsers.jsx";
import MsgBoard from "app/containers/MsgBoard/MsgBoard.jsx";
import ClientsBoard from "app/containers/ClientsBoard/ClientsBoard.jsx";
import "./MainScreen.scss";

const MainScreen = ({ client, clients }) => (
  <div className="MainScreen">
    <Tabs>
      <Tab label="Message Board">
        <Header nickname={client.nickname} clients={clients} />

        <div className="MainScreen__flex">
          <ConnectedUsers />
          <MsgBoard />
        </div>
      </Tab>

      <Tab label="Credentials">
        <ClientsBoard />
      </Tab>
    </Tabs>
  </div>
);

const mapStateToProps = ({ client, clients }) => ({
  client,
  clients: Object.keys(clients).length
});
const MainScreenContainer = connect(mapStateToProps)(MainScreen);

export default MainScreenContainer;
