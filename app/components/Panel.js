// @flow
import React, {Component} from 'react';
import {initWs} from '../actions/player';
import {connect} from 'react-redux';

const {BrowserWindow} = window.require('electron').remote;
let mainWindow;
setTimeout(() => mainWindow = BrowserWindow.getFocusedWindow(), 1000);

type IProps = {
  initWs: () => void,
  currentChannel: string,
};

class Panel extends Component<IProps> {
  switchChannel = () => {
    const {currentChannel} = this.props;
    this.props.initWs(currentChannel === 'JP' ? 'KR' : 'JP');
  };

  openSettings = () => {
    console.log('Will open it at some point...');
  };

  render() {
    const {currentChannel} = this.props;
    const isJpActive = currentChannel === 'JP' || !currentChannel;
    return (
      <div className="panel">
        <div className="panel-top">
          <div className="fa fa-gear" onClick={this.openSettings}/>
          <div className="fa fa-close" onClick={() => mainWindow.close()}/>
        </div>
        <div className="channel-switch">
          <span
            className={isJpActive ? 'active' : ''}
            onClick={isJpActive ? null : this.switchChannel}
          >
            JP
          </span>
          <span
            className={isJpActive ? '' : 'active'}
            onClick={isJpActive ? this.switchChannel : null}
          >
            KR
          </span>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  initWs,
};

function mapStateToProps(state) {
  return {
    currentChannel: state.player.channel,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Panel);
