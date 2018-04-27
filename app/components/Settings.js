// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';

type IProps = {};

class Settings extends Component<IProps> {
  constructor(props) {
    super(props);
    this.state = {};
    this.server = null;
  }

  render() {
    return (
      <div className="settings">
        Init
      </div>
    );
  }
}

const mapDispatchToProps = {};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
