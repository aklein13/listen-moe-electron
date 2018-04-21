// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import Client from 'electron-rpc/client';
import {playPause, initWs} from '../actions/player';
import {JP_STREAM, KR_STREAM} from '../actionTypes';

type Props = {
  initWs: () => void,
  playPause: () => void,
  currentChannel: string,
  currentSong: any,
  isPlaying: boolean,
};

class Player extends Component<Props> {
  props: Props;
  client: any;

  componentWillMount() {
    this.client = new Client();
    this.client.on('media_play', () => this.props.playPause());
    this.client.on('media_switch', this.switchChannel);
    this.props.initWs();
  }

  switchChannel = () => {
    const {currentChannel} = this.props;
    this.props.initWs(currentChannel === 'JP' ? 'KR' : 'JP');
  };

  renderPlayButton() {
    const {isPlaying} = this.props;
    const playerClass = `btn-pause-play fa fa-${isPlaying ? 'pause' : 'play'}`;
    return (
      <div className={playerClass} onClick={this.props.playPause}/>
    )
  }

  renderAudioPlayer() {
    const {currentChannel} = this.props;
    const streamUrl = currentChannel === 'JP' ? JP_STREAM : KR_STREAM;
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
    currentChannel: state.player.channel,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Player);
