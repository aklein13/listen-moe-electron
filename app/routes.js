import React from 'react';
import {Switch, Route} from 'react-router';
import App from './containers/App';
import Home from './components/Home';
import Counter from './components/Counter';

export default () => (
  <App>
    <Switch>
      <Route path="/counter" component={Counter}/>
      <Route path="/" component={Home}/>
    </Switch>
  </App>
);
