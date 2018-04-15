import React from 'react';
import {render} from 'react-dom';
import {AppContainer} from 'react-hot-loader';
import Root from './containers/Root';
import {configureStore, history} from './store/configureStore';
import {playPause} from './actions/player';
import './app.global.scss';
import Client from 'electron-rpc/client';
const client = new Client();

const store = configureStore();

render(
  <AppContainer>
    <Root store={store} history={history}/>
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    const NextRoot = require('./containers/Root');
    render(
      <AppContainer>
        <NextRoot store={store} history={history}/>
      </AppContainer>,
      document.getElementById('root')
    );
  });
}

client.on('media_play', (err, body) => {
  store.dispatch(playPause());
});
