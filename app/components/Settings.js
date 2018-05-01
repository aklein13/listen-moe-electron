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
};

class Settings extends Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      password: '',
    };
  }

  componentWillMount() {
    const previousLogin = localStorage.getItem('login');
    if (previousLogin) {
      this.setState({login: previousLogin});
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.error && this.props.error !== newProps.error) {
      alert(newProps.error);
      this.props.clearAuthError();
    }
  }

  handleFormChange = (e, field) => this.setState({[field]: e.target.value});

  handleFormSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.login(this.state.login, this.state.password);
  };

  render() {
    const {login, password} = this.state;
    return (
      <div className="settings">
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
        </form>
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
