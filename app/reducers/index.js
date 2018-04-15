// @flow
import {combineReducers} from 'redux';
import {routerReducer as router} from 'react-router-redux';
import counter from './counter';
import player from './player';

const rootReducer = combineReducers({
  counter,
  player,
  router,
});

export default rootReducer;
