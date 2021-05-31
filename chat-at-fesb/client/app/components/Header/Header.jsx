import React, { PureComponent as Component } from "react";
import classnames from "classnames";
import "./Header.scss";

const faces = [
  "(<>..<>)",
  "(✰‿✰)",
  "(ಠ۾ಠ)",
  "ʕ•ᴥ•ʔ",
  "(ᵔᴥᵔ)",
  "◉_◉",
  "◕‿◕",
  "(ʘ‿ʘ)",
  "(♥_♥)"
];

const LocalUser = ({ children: user }) => (
  <div>
    You <span className="Header__nickname">{user}</span>
  </div>
);

const Face = ({ children: face }) => (
  <div className="Header__emoji">{face}</div>
);

const Clients = ({ children, emph }) => {
  const className = classnames({
    Header__clients: !emph,
    "Header__clients-emph": emph
  });
  return (
    <div className="Header__flex-container">
      Users online: <div className={className}>{children}</div>
    </div>
  );
};

export default class extends Component {
  state = {
    emph: false
  };

  componentWillMount() {
    this.face = faces[Math.floor(Math.random() * faces.length)];
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.clients !== this.props.clients) {
      this.setState({ emph: true });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.clients !== this.props.clients) {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.setState({ emph: false });
      }, 1000);
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  render() {
    const { nickname, clients } = this.props;
    const { emph } = this.state;

    return (
      <div className="Header">
        <LocalUser>{nickname}</LocalUser>
        <Face>{this.face}</Face>
        <Clients emph={emph}>{clients}</Clients>
      </div>
    );
  }
}
