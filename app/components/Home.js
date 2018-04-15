// @flow
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {playPause} from '../actions/player';

type Props = {
};

class Home extends Component<Props> {
  props: Props;

  renderPlayButton() {
    const {isPlaying} = this.props;
    const playerClass = `fa fa-${isPlaying ? 'pause' : 'play'}`;
    return (
      <div className={playerClass} onClick={this.props.playPause}/>
    )
  }

  render() {
    console.log(this.props.isPlaying);
    return (
      <div>
        <div className="container" data-tid="container">
          <h2>Home</h2>
          <Link to="/counter">to Counter</Link>
          {this.renderPlayButton()}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  playPause,
};

function mapStateToProps(state) {
  return {
    isPlaying: state.player.isPlaying,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
