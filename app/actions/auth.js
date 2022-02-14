import Client from 'electron-rpc/client';
import { ACTIONS } from '../constants';
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import loginQuery from '../gql/login.gql';
import userQuery from '../gql/user.gql';
import favoriteQuery from '../gql/favorite.gql';
import { setContext } from '@apollo/client/link/context';

const rpcClient = new Client();

const apolloOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
  },
  query: {
    fetchPolicy: 'no-cache',
  },
};
const httpLink = createHttpLink({
  uri: 'https://listen.moe/graphql',
});
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});
const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: apolloOptions,
});

export const login = (login, password) => {
  return (dispatch) => {
    apolloClient
      .query({
        query: loginQuery,
        variables: {
          username: login,
          password,
        },
      })
      .catch((error) => {
        console.error('Error:', error);
        return dispatch({ type: ACTIONS.LOGIN_ERROR });
      })
      .then(({ data }) => {
        const { token, user } = data.login;
        if (!token) {
          return dispatch({ type: ACTIONS.LOGIN_ERROR });
        }
        localStorage.setItem('token', token);
        apolloClient.resetStore();
        const { username } = user;
        dispatch({
          type: ACTIONS.LOGIN_SUCCESS,
          payload: { token, login, username },
        });
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        rpcClient.request('logged_in', { login, token, username });
      });
  };
};

export const fetchFavourites = (username) => {
  return (dispatch) => {
    apolloClient
      .query({
        query: userQuery,
        variables: {
          username,
        },
      })
      .then(({ data }) => {
        dispatch({
          type: ACTIONS.LOAD_FAVOURITES,
          payload: { favourites: data.user.favorites.favorites },
        });
      });
  };
};

export const manageFavourite = (songId, token, shouldBeFav) => {
  return (dispatch) => {
    // Assume request won't fail to make it instant
    dispatch({
      type: ACTIONS.SET_FAVOURITE,
      payload: { songId, shouldBeFav },
    });
     apolloClient
       .query({
         query: favoriteQuery,
         variables: { id: songId },
       }).then((response) => {
       if (response.ok) {
         return true;
      }
      throw new Error('Request failed.');
    })
      .catch(error => {
        console.error(error);
        alert(`Error: ${error}`);
        dispatch({
          type: ACTIONS.SET_FAVOURITE,
          payload: { songId, shouldBeFav: !shouldBeFav },
        });
      });
  };
};

export function clearAuthError() {
  return { type: ACTIONS.CLEAR_ERROR };
}

export function setUser(login, token) {
  return {
    type: ACTIONS.SET_USER,
    payload: { token, login },
  };
}

export function logOut(fromPlayer = false) {
  if (!fromPlayer) {
    localStorage.removeItem('token');
    apolloClient.resetStore();
    rpcClient.request('logged_out');
  }
  return { type: ACTIONS.LOG_OUT };
}
