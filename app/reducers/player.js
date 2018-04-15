import {ACTIONS} from '../actionTypes';

const initialState = {
  isPlaying: false,
};

export default function player(state = initialState, action: any) {
  switch (action.type) {
    case ACTIONS.PLAY_PAUSE:
      return {
        ...state,
        isPlaying: !state.isPlaying,
      };
    default:
      return state;
  }
}
