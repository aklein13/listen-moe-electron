import {ACTIONS} from '../actionTypes';

const initialState = {
  isPlaying: false,
  currentSong: null,
};

const getArtistNames = (artists) => '' + artists.map((artist) => artist.name).join();

export default function player(state = initialState, action: any) {
  switch (action.type) {
    case ACTIONS.PLAY_PAUSE:
      return {
        ...state,
        isPlaying: !state.isPlaying,
      };
    case ACTIONS.SET_SONG:
      const {song, requester} = action.payload;
      const newSong = {
        title: song.title,
        subTitle: getArtistNames(song.artists),
        requester: requester ? requester.displayName : null,
      };
      return {
        ...state,
        currentSong: newSong,
      };
    default:
      return state;
  }
}
