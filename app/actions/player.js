import {ACTIONS} from '../actionTypes';
import {JP_WS, KR_WS} from '../actionTypes';

export function playPause() {
  return {type: ACTIONS.PLAY_PAUSE};
}

export const initWs = (type = 'JP') => {
  return (dispatch) => {
    const listenMoeWs = new WebSocket(type === 'JP' ? JP_WS : KR_WS);
    let sendHeartbeat;
    const setHeartbeat = (ms) => {
      sendHeartbeat = setInterval(() => {
        listenMoeWs.send(JSON.stringify({op: 9}));
      }, ms);
    };
    listenMoeWs.onopen = () => {
      console.log('Websocket connection established.');
      listenMoeWs.send(JSON.stringify({ op: 0, d: { auth: '' } }));
    };

    listenMoeWs.onerror = (err) => {
      console.error(err);
    };
    listenMoeWs.onmessage = async (message) => {
      let response;
      try {
        response = JSON.parse(message.data);
      }
      catch (error) {
        console.warn(error, message.data);
        return;
      }
      //console.log('WSDATA', response);
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
