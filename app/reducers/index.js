// @flow
import {combineReducers} from 'redux';
import {routerReducer as router} from 'react-router-redux';
import player from './player';

const rootReducer = combineReducers({
  player,
  router,
});

export default rootReducer;
