// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import Client from 'electron-rpc/client';
import {playPause, initWs, stopWs} from '../actions/player';
import {JP_STREAM, KR_STREAM} from '../actionTypes';
import Panel from './Panel';
import Marquee from 'marquee-react-dwyer';

type IProps = {
  initWs: () => void,
  playPause: () => void,
  currentChannel: string,
  currentSong: any,
  isPlaying: boolean,
};

type IState = {
  volume: number,
};

class Player extends Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.client = null;
    this.player = null;
    this.state = {
      volume: 50,
    };
  }

  componentWillMount() {
    this.props.initWs();
    const previousVolume = parseInt(localStorage.getItem('volume'));
    if (previousVolume) {
      this.setState({volume: previousVolume});
    }
    this.client = new Client();
    this.client.on('media_play', () => this.props.playPause());
    this.client.on('media_switch', this.switchChannel);
    window.addEventListener('mousewheel', this.manageScroll);
  }

  componentDidMount() {
    this.player = document.getElementById('audio-player');
    this.player.volume = (this.state.volume / 100).toFixed(2);
  }

  componentWillUnmount() {
    this.props.stopWs();
  }

  manageScroll = (e) => {
    const {player} = this;
    if (!player) {
      this.player = document.getElementById('audio-player');
      return;
    }
    let {volume} = this.state;
    if (e.wheelDelta >= 0 && volume <= 95) {
      volume += 5;
      player.volume = (volume / 100).toFixed(2);
      this.setState({volume});
      localStorage.setItem('volume', volume);
    }
    else if (e.wheelDelta < 0 && volume >= 5) {
      volume -= 5;
      player.volume = (volume / 100).toFixed(2);
      this.setState({volume});
      localStorage.setItem('volume', volume);
    }
  };

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
    const {isPlaying, currentChannel} = this.props;
    let streamUrl = '';
    if (isPlaying) {
      streamUrl = currentChannel === 'JP' ? JP_STREAM : KR_STREAM;
    }
    return (
      <audio autoPlay id="audio-player" crossOrigin="anonymous" preload="auto" src={streamUrl}/>
    );
  }

  renderVolume() {
    const {volume} = this.state;
    return (
      <span className="player-volume">
        {volume}%
      </span>
    )
  }

  renderEventsOverlay() {
    // Need this to handle mouse events on one side of the song detail info and window drag on the other
    return (
      <div id="events-overlay">
        <div className="drag"/>
        <div className="mouse"/>
      </div>
    )
  }

  renderSongInfo() {
    const {currentSong} = this.props;
    if (!currentSong) {
      return (
        <div className="song-info loading">
          <p>Loading...</p>
        </div>
      );
    }
    // TODO Some better overflow detection?
    return (
      <div className="song-info">
        {currentSong.subTitle.length > 25 ?
          <Marquee
            Size="h3"
            NumberOfOptions="1"
            Index0={currentSong.subTitle}
            TimeToCross="12000"
            Color="white"
          />
          :
          <h3>{currentSong.subTitle}</h3>
        }
        {currentSong.title.length > 17 ?
          <Marquee
            Size="h2"
            NumberOfOptions="1"
            Index0={currentSong.title}
            TimeToCross="12000"
            Color="white"
          />
          :
          <h2>{currentSong.title}</h2>
        }
        {currentSong.requester &&
        <h3 className="requested">Requested by: {currentSong.requester}</h3>
        }
        {this.renderEventsOverlay()}
      </div>
    )
  }

  render() {
    return (
      <div id="player-wrapper">
        <div id="player">
          {this.renderAudioPlayer()}
          {this.renderPlayButton()}
          {this.renderSongInfo()}
          {this.renderVolume()}
        </div>
        <Panel/>
      </div>
    );
  }
}

const mapDispatchToProps = {
  playPause,
  initWs,
  stopWs,
};

function mapStateToProps(state) {
  return {
    isPlaying: state.player.isPlaying,
    currentSong: state.player.currentSong,
    currentChannel: state.player.channel,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Player);
