import React from "react";
import { connect } from "react-redux";
import DecoratedLetter from "app/components/DecoratedLetter.jsx";
import "./ConnectedUsers.scss";

import Lock from "app/components/Lock.jsx";

const ConnectedUsers = ({ clients, credentials, ui }) => {
  let decoratedClients = (
    <div className="ConnectedUsers__shrug">¯\_(ツ)_/¯</div>
  );

  if (Object.keys(clients).length > 0) {
    decoratedClients = Object.keys(clients).map(key => {
      const lockOpen =
        credentials.hasOwnProperty(key) && credentials[key].symmetric["key"]
          ? false
          : true;

      return (
        <div key={key} className="ConnectedUsers__row">
          <DecoratedLetter color={ui[key]["color"]} letter={clients[key][0]} />

          <div className="ConnectedUsers__nickname-cell">{clients[key]}</div>
          <div>
            <Lock open={lockOpen} />
          </div>
        </div>
      );
    });
  }

  return (
    <div className="ConnectedUsers">
      <div className="ConnectedUsers__header">Other users:</div>
      {decoratedClients}
    </div>
  );
};

const ConnectedUsersContainer = connect(({ clients, credentials, ui }) => ({
  clients,
  credentials,
  ui
}))(ConnectedUsers);

export default ConnectedUsersContainer;
