import React, { Component } from "react";
import { connect } from "react-redux";
import { generateKey, deleteKey } from "app/redux/actions/securityActions.js";
import TableRow from "./TableRow.jsx";
import "./ClientsBoard.scss";

const HeaderTr = ({ children, direction = "out", span = 4 }) => (
  <tr>
    <td
      colSpan={span}
      className={`ClientsBoard__header-tr ClientsBoard__header-tr--${direction}`}
    >
      {children}
    </td>
  </tr>
);

class ClientsBoard extends Component {
  _handleGenerateKey = payload => {
    this.props.generateKey(payload);
  };

  _handleDeleteKey = id => {
    this.props.deleteKey(id);
  };

  render() {
    const { client, clients, credentials, ui } = this.props;

    const _clients = Object.keys(clients).map((id, index) => {
      return (
        <TableRow
          key={index}
          client={{ id, nickname: clients[id] }}
          color={ui[id]["color"]}
          credentials={credentials[id]}
          generateKey={this._handleGenerateKey}
          deleteKey={this._handleDeleteKey}
        />
      );
    });

    return (
      <div className="ClientsBoard">
        <table className="ClientsBoard__table">
          <tbody>
            <HeaderTr>Your key</HeaderTr>
            <TableRow
              client={client}
              credentials={credentials[client.id]}
              generateKey={this._handleGenerateKey}
              deleteKey={this._handleDeleteKey}
            />

            {_clients.length > 0 && (
              <HeaderTr direction="in">Other users' keys</HeaderTr>
            )}
            {_clients}
          </tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = ({ client, clients, credentials, ui }) => ({
  client,
  clients,
  credentials,
  ui
});
const ClientsBoardContainer = connect(
  mapStateToProps,
  { generateKey, deleteKey }
)(ClientsBoard);

export default ClientsBoardContainer;
