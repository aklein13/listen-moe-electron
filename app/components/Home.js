// @flow
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {playPause, initWs} from '../actions/player';
import {JP_STREAM, KR_STREAM} from '../actionTypes';

type Props = {
  initWs: () => void,
  playPause: () => void,
};

class Home extends Component<Props> {
  props: Props;

  componentWillMount() {
    this.props.initWs();
  }

  renderPlayButton() {
    const {isPlaying} = this.props;
    const playerClass = `fa fa-${isPlaying ? 'pause' : 'play'}`;
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
    return (
      <div>
        <h2>Title: {song.title}</h2>
        <h2>Subtitle: {song.subTitle}</h2>
        {song.requester && <h2>Requested by: {song.requester}</h2>}
      </div>
    )
  }

  render() {
    const {isPlaying, currentSong} = this.props;
    return (
      <div>
        <div className="container" data-tid="container">
          {isPlaying && this.renderAudioPlayer()}
          <br/>
          {currentSong && this.renderSongInfo(currentSong)}
          <Link to="/counter">to Counter</Link>
          {this.renderPlayButton()}
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
