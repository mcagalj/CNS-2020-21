import React, { Component } from "react";
import { SimpleSpinner as Spinner } from "app/components/Spinner/Spinner.jsx";
import DecoratedLetter from "app/components/DecoratedLetter.jsx";
import Lock from "app/components/Lock.jsx";

const SpinnerCell = ({ spinning, children }) => (
  <td style={{ position: "relative" }}>
    {children}
    {spinning && <Spinner border="2px" width="1.25rem" />}
  </td>
);

const DecorateStatus = ({ active, children }) => (
  <div className="ClientsBoard__flex-container">
    <Lock open={!active} /> {children}
  </div>
);

const StatusCell = ({ keyStatus, children }) => {
  const { key, isGenerating } = keyStatus;
  if (isGenerating) return <td style={{ textAlign: "left" }}>Generating...</td>;

  return (
    <td>
      <DecorateStatus active={key ? true : false}>
        {key ? "Active" : children}
      </DecorateStatus>
    </td>
  );
};

const ButtonCell = ({ onClick, children }) => (
  <td>
    <div className="ClientsBoard__button" onClick={onClick}>
      {children}
    </div>
  </td>
);

class TableRow extends Component {
  state = { secret: "" };

  _handleKeyPress = event => {
    if (event.key === "Enter") {
      this.enter = true;
      this._handleBlur();
      event.target.blur();
      event.preventDefault();
      return;
    }

    // Ignore <space>
    if (event.which === 32) {
      event.preventDefault();
    }
  };

  _handleInputChange = event => {
    this.setState({ secret: event.target.value });
    event.preventDefault();
  };

  _handleBlur = () => {
    if (this.enter) {
      this.enter = false;
      return;
    }

    let { secret } = this.state;
    if (!secret) return;

    this.props.generateKey({ secret, id: this.props.client.id });
    this.setState({ secret: "" });
  };

  _handleButtonClick = () => {
    if (!this.props.credentials) return;

    const { symmetric = { key: null } } = this.props.credentials;
    if (!symmetric || !symmetric.key) return;

    this.props.deleteKey(this.props.client.id);
  };

  render() {
    const { client, credentials = {}, color } = this.props;
    const { symmetric = { key: null, isGenerating: false } } = credentials;

    return (
      <tr>
        <td className="ClientsBoard__nickname-td">
          <DecoratedLetter color={color} letter={client.nickname[0]} />

          <div className="ClientsBoard__nickname-cell">{client.nickname}</div>
        </td>

        <SpinnerCell spinning={symmetric.isGenerating}>
          <input
            type="password"
            className="ClientsBoard__secret"
            placeholder="Enter a secret"
            value={this.state.secret}
            onChange={this._handleInputChange}
            onKeyPress={this._handleKeyPress}
            onBlur={this._handleBlur}
          />
        </SpinnerCell>

        <StatusCell keyStatus={symmetric}>No key</StatusCell>

        <ButtonCell onClick={this._handleButtonClick}>Delete key</ButtonCell>
      </tr>
    );
  }
}

export default TableRow;
