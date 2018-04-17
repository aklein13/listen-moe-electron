// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {playPause, initWs} from '../actions/player';
import {JP_STREAM, KR_STREAM} from '../actionTypes';

type Props = {
  initWs: () => void,
  playPause: () => void,
};

class Player extends Component<Props> {
  props: Props;

  componentWillMount() {
    this.props.initWs();
  }

  renderPlayButton() {
    const {isPlaying} = this.props;
    const playerClass = `btn-pause-play fa fa-${isPlaying ? 'pause' : 'play'}`;
    return (
      <div className={playerClass} onClick={this.props.playPause}/>
    )
  }

  renderAudioPlayer() {
    const {playerType} = this.props;
    const streamUrl = playerType === 'KR' ? KR_STREAM : JP_STREAM;
    return (
      <audio autoPlay id="audio-player" crossOrigin="anonymous" preload="auto" src={streamUrl}/>
    );
  }

  renderSongInfo(song) {
    if (!song) {
      return (
        <div className="song-info loading">
          <p>Please wait...</p>
        </div>
      );
    }
    return (
      <div className="song-info">
        <h3>{song.subTitle}</h3>
        <h2 id="title">{song.title}</h2>
        {song.requester &&
        <h3 className="requested">Requested by: {song.requester}</h3>
        }
      </div>
    )
  }

  render() {
    const {isPlaying, currentSong} = this.props;
    return (
      <div className="player">
        {isPlaying && this.renderAudioPlayer()}
        {this.renderPlayButton()}
        {this.renderSongInfo(currentSong)}
      </div>
    );
  }
}

const mapDispatchToProps = {
  playPause,
  initWs,
};

function mapStateToProps(state) {
  return {
    isPlaying: state.player.isPlaying,
    currentSong: state.player.currentSong,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Player);
