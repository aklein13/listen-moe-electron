// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {login, clearAuthError} from '../actions/auth';

type IProps = {
  clearAuthError: () => void,
  login: () => void,
};

type IState = {
  login: string,
  password: string,
  token: any,
};

class Settings extends Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      password: '',
      token: null,
    };
  }

  componentWillMount() {
    const previousLogin = localStorage.getItem('login');
    const previousToken = localStorage.getItem('token');
    if (previousLogin) {
      this.setState({login: previousLogin, token: previousToken ? previousToken : null});
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
    const previousToken = localStorage.setItem('token', '');
    if (previousLogin) {
      this.setState({login: previousLogin, token: previousToken ? previousToken : null});
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

  render() {
    return (
      <div className="settings-container">
        {this.renderLoginForm()}
        <div className="settings"/>
      </div>
    );
  }
}

const mapDispatchToProps = {
  login,
  clearAuthError,
};

function mapStateToProps(state) {
  return {
    error: state.auth.error,
    token: state.auth.token,
    login: state.auth.login,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
