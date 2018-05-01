import {ACTIONS, API_HEADERS, API_URL} from '../actionTypes';

export const login = (login, password) => {
  return (dispatch) => {
    const headers = new Headers(API_HEADERS);
    const body = {
      username: login,
      password,
    };
    const init = {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    };
    const url = API_URL + 'login';
    const request = new Request(url);
    fetch(request, init).then((response) => response.json())
      .catch(error => {
        dispatch({type: ACTIONS.LOGIN_ERROR});
        console.error('Error:', error);
      })
      .then((data) => {
        const {token} = data;
        if (!token) {
          return dispatch({type: ACTIONS.LOGIN_ERROR});
        }
        dispatch({
          type: ACTIONS.LOGIN_SUCCESS,
          payload: {token, login},
        });
        localStorage.setItem('login', login);
        localStorage.setItem('token', token);
      });
  }
};

export function clearAuthError() {
  return {type: ACTIONS.CLEAR_ERROR}
}
