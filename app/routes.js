import React from 'react';
import {Switch, Route} from 'react-router';
import App from './containers/App';
import Player from './components/Player';
import Panel from './components/Panel';

export default () => (
  <App>
    <Switch>
      <Route path="/settings" component={Panel}/>
      <Route path="/" component={Player}/>
    </Switch>
  </App>
);
