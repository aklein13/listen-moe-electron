import {ACTIONS} from '../actionTypes';

const initialState = {
  login: '',
  token: null,
  error: '',
};

export default function auth(state = initialState, action: any) {
  switch (action.type) {
    case ACTIONS.LOGIN_ERROR:
      return {
        ...state,
        error: 'Invalid login on password',
      };
      case ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: '',
      };
    case ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        login: action.payload.login,
        token: action.payload.token,
      };
    default:
      return state;
  }
}