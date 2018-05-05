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
        alert('Network request failed');
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

export const fetchFavourites = (login, token) => {
  return (dispatch) => {
    const headers = new Headers(API_HEADERS);
    headers.append('Authorization', 'Bearer ' + token);
    const init = {
      method: 'GET',
      headers,
    };
    const url = `${API_URL}favorites/${login}`;
    const request = new Request(url);
    fetch(request, init).then((response) => response.json())
      .catch(error => {
        console.error('Error:', error);
      })
      .then((data) => {
        if (data && data.favorites) {
          dispatch({
            type: ACTIONS.LOAD_FAVOURITES,
            payload: {favourites: data.favorites},
          })
        }
      });
  }
};

export const manageFavourite = (songId, token, shouldBeFav) => {
  return (dispatch) => {
    const headers = new Headers(API_HEADERS);
    headers.append('Authorization', 'Bearer ' + token);
    const init = {
      method: shouldBeFav ? 'POST' : 'DELETE',
      headers,
    };
    const url = `${API_URL}favorites/${songId}`;
    const request = new Request(url);
    fetch(request, init).then((response) => {
      if (response.ok) {
        return true;
      }
      throw new Error('Request failed.');
    })
      .catch(error => {
        console.error('Error:', error);
      })
      .then(() => {
        dispatch({
          type: ACTIONS.SET_FAVOURITE,
          payload: {songId, shouldBeFav},
        })
      });
  }
};

export function clearAuthError() {
  return {type: ACTIONS.CLEAR_ERROR}
}

export function setUser(login, token) {
  return {
    type: ACTIONS.SET_USER,
    payload: {token, login},
  }
}
