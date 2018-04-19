import {ACTIONS} from '../actionTypes';
import {JP_WS, KR_WS} from '../actionTypes';

export function playPause() {
  return {type: ACTIONS.PLAY_PAUSE};
}

let listenMoeWs;
let sendHeartbeat;

const setHeartbeat = (ms) => {
  sendHeartbeat = setInterval(() => {
    listenMoeWs.send(JSON.stringify({op: 9}));
  }, ms);
};

export const initWs = (channel = 'JP') => {
  return (dispatch) => {
    if (listenMoeWs) {
      listenMoeWs.close();
      clearInterval(sendHeartbeat);
    }
    listenMoeWs = new WebSocket(channel === 'JP' ? JP_WS : KR_WS);

    listenMoeWs.onopen = () => {
      dispatch({
        type: ACTIONS.SET_CHANNEL,
        payload: {channel},
      });
      listenMoeWs.send(JSON.stringify({op: 0, d: {auth: ''}}));
      console.log('Websocket connection established on ' + channel);
    };

    listenMoeWs.onerror = (err) => {
      console.error(err);
    };

    listenMoeWs.onmessage = async (message) => {
      let response;
      // console.log('WSMESSAGE', message);
      try {
        response = JSON.parse(message.data);
      }
      catch (error) {
        console.warn(error, message.data);
        return;
      }
      // console.log('WSDATA', response);
      if (response.op === 0) {
        return setHeartbeat(response.d.heartbeat);
      }
      if (response.op === 1) {
        dispatch({
          type: ACTIONS.SET_SONG,
          payload: {
            song: response.d.song,
            requester: response.d.requester,
          },
        })
      }
    }
  };
};
