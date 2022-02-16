// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {login, clearAuthError, logOut} from '../actions/auth';
import CheckBox from './CheckBox';
import Client from 'electron-rpc/client';

const primaryColor = '#740000';
const textColor = '#ffffff';

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
  autoStop: boolean,
};

class Settings extends Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      password: '',
      token: null,
      autoPlay: false,
      autoStop: true,
      primaryColor,
      textColor,
    };
    this.client = new Client();
  }

  componentWillMount() {
    const previousLogin = localStorage.getItem('login');
    const previousToken = localStorage.getItem('token');
    const autoPlay = localStorage.getItem('autoPlay');
    const autoStop = localStorage.getItem('autoStop');
    if (previousLogin) {
      this.setState({login: previousLogin, token: previousToken ? previousToken : null});
    }
    if (autoPlay) {
      this.setState({autoPlay: autoPlay === 'true'});
    }
    if (autoStop) {
      this.setState({autoStop: autoStop === 'true'});
    }
    const savedPrimaryColor = localStorage.getItem('primaryColor');
    const savedTextColor = localStorage.getItem('textColor');
    if (savedPrimaryColor) {
      this.setState({primaryColor: savedPrimaryColor});
      document.documentElement.style.setProperty('--primary', savedPrimaryColor);
    }
    if (savedTextColor) {
      this.setState({textColor: savedTextColor});
      document.documentElement.style.setProperty('--text-color', savedTextColor);
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
    this.props.login(this.state.login, this.state.password);
  };

  handleLogOut = () => {
    const previousLogin = localStorage.getItem('login');
    this.props.logOut();
    if (previousLogin) {
      this.setState({login: previousLogin, token: null});
    }
  };

  handleRegister = () => {
    this.client.request('open_register');
  };

  renderLoginForm() {
    const {login, password, token} = this.state;
    if (token) {
      return (
        <div className="login-form">
          <p className="logged">
            Logged in as <b>{login}</b>
          </p>
          <div className="button" onClick={this.handleLogOut}>
            Log out
          </div>
        </div>
      );
    }
    return (
      <div className="login-form">
        <form onSubmit={this.handleFormSubmit}>
          <input
            placeholder="Login"
            name="Login"
            type="text"
            value={login}
            required
            onChange={(e) => this.handleFormChange(e, 'login')}
          />
          <input
            placeholder="Password"
            name="Password"
            type="password"
            value={password}
            required
            onChange={(e) => this.handleFormChange(e, 'password')}
          />
          <button type="submit">
            Log in
          </button>
          <div className="button" onClick={this.handleFormSubmit}>
            Log in
          </div>
          <div className="button" onClick={this.handleRegister}>
            Register
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

  changeAutoStop = () => {
    const autoStop = !this.state.autoStop;
    this.setState({autoStop});
    localStorage.setItem('autoStop', autoStop);
  };

  resetColors = () => {
    this.changeColor(primaryColor, 'primary');
    this.changeColor(textColor, 'text');
  };

  changeColor = (value: string, name: string) => {
    if (name === 'primary') {
      this.setState({primaryColor: value});
      document.documentElement.style.setProperty('--primary', value);
    } else {
      this.setState({textColor: value});
      document.documentElement.style.setProperty('--text-color', value);
    }
    this.client.request('color_change', {name, value});
  };

  renderSettings() {
    const {autoPlay, autoStop, primaryColor, textColor} = this.state;
    return (
      <div className="settings">
        <div className="item wrap">
          <label>Auto play</label>
          <div className="checkbox-container">
            <CheckBox checked={autoPlay} onCheck={this.changeAutoPlay}/>
          </div>
        </div>
        <div className="item wrap">
          <label>Stop on audio device disconnect</label>
          <div className="checkbox-container">
            <CheckBox checked={autoStop} onCheck={this.changeAutoStop}/>
          </div>
        </div>
        <div className="item wrap" style={{marginTop: 15}}>
          <label>Main color</label>
          <input
            type="color"
            value={primaryColor}
            onChange={(e) => this.changeColor(e.target.value, 'primary')}
          />
        </div>
        <div className="item wrap">
          <label>Text color</label>
          <input
            type="color"
            value={textColor}
            onChange={(e) => this.changeColor(e.target.value, 'text')}
          />
        </div>
        <div className="button" onClick={this.resetColors}>
          Reset colors
        </div>
      </div>
    );
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
