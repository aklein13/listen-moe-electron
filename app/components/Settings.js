// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {login, clearAuthError, logOut} from '../actions/auth';
import CheckBox from './CheckBox';

type IProps = {
  clearAuthError: () => void,
  login: () => void,
  logOut: () => void,
};

type IState = {
  login: string,
  password: string,
  token: any,
  autoPlay: boolean,
};

class Settings extends Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      password: '',
      token: null,
      autoPlay: false,
    };
  }

  componentWillMount() {
    const previousLogin = localStorage.getItem('login');
    const previousToken = localStorage.getItem('token');
    const autoPlay = localStorage.getItem('autoPlay');
    if (previousLogin) {
      this.setState({login: previousLogin, token: previousToken ? previousToken : null});
    }
    if (autoPlay) {
      this.setState({autoPlay: autoPlay === 'true'});
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.error && this.props.error !== newProps.error) {
      alert(newProps.error);
      this.props.clearAuthError();
    }
    if (newProps.token && this.props.token !== newProps.token) {
      this.setState({token: newProps.token});
    }
  }

  handleFormChange = (e, field) => this.setState({[field]: e.target.value});

  handleFormSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.login(this.state.login, this.state.password);
  };

  handleLogOut = () => {
    const previousLogin = localStorage.getItem('login');
    this.props.logOut();
    if (previousLogin) {
      this.setState({login: previousLogin, token: null});
    }
  };

  renderLoginForm() {
    const {login, password, token} = this.state;
    if (token) {
      return (
        <div className="login-form">
          <p className="logged">
            Logged in as {login}
          </p>
          <div className="button" onClick={this.handleLogOut}>
            Log out
          </div>
        </div>
      )
    }
    return (
      <div className="login-form">
        <form onSubmit={this.handleFormSubmit}>
          <input
            placeholder="Login"
            name="Login"
            type="text"
            value={login}
            onChange={(e) => this.handleFormChange(e, 'login')}
          />
          <input
            placeholder="Password"
            name="Password"
            type="password"
            value={password}
            onChange={(e) => this.handleFormChange(e, 'password')}
          />
          <button type="submit">
            Log in
          </button>
          <div className="button" onClick={this.handleFormSubmit}>
            Log in
          </div>
        </form>
      </div>
    );
  }

  changeAutoPlay = () => {
    const autoPlay = !this.state.autoPlay;
    this.setState({autoPlay});
    localStorage.setItem('autoPlay', autoPlay);
  };

  renderSettings() {
    const {autoPlay} = this.state;
    return (
      <div className="settings">
        <div className="item">
          <label>Auto play</label>
          <CheckBox checked={autoPlay} onCheck={this.changeAutoPlay}/>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="settings-container">
        {this.renderLoginForm()}
        {this.renderSettings()}
      </div>
    );
  }
}

const mapDispatchToProps = {
  login,
  clearAuthError,
  logOut,
};

function mapStateToProps(state) {
  return {
    error: state.auth.error,
    token: state.auth.token,
    login: state.auth.login,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
