import React from 'react';
import {Switch, Route} from 'react-router';
import App from './containers/App';
import Player from './components/Player';

export default () => (
  <App>
    <Switch>
      <Route path="/" component={Player}/>
    </Switch>
  </App>
);
