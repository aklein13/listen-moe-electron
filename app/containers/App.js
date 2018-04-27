// @flow
import * as React from 'react';
import Panel from '../components/Panel';

type Props = {
  children: React.Node
};

export default class App extends React.Component<Props> {
  props: Props;

  render() {
    return (
      <div className="container">
        {this.props.children}
        <Panel/>
      </div>
    );
  }
}
