import {API_HEADERS, API_URL} from '../actionTypes';

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
      .catch(error => console.error('Error:', error))
      .then((data) => {
        localStorage.setItem('login', login);
        console.log(data);
        // TODO Handle data with token
      });
  }
};
