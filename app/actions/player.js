import {ACTIONS} from '../actionTypes';
import {JP_WS, KR_WS} from '../actionTypes';

export function playPause() {
  return {type: ACTIONS.PLAY_PAUSE};
}

export const initWs = (type = 'JP') => {
  return (dispatch) => {
    var listenMoeWs = new WebSocket(type === 'JP' ? JP_WS : KR_WS);
    console.log('WS INIT');
    listenMoeWs.onopen = (msg) => {
      console.info('Websocket connection established.', msg);
    };

    listenMoeWs.onerror = (err) => {
      console.error(err);
    };
    listenMoeWs.onmessage = async (message) => {
      console.log('WSDATA', message.data);
    }
  };
};
