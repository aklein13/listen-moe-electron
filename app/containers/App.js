// @flow
import * as React from 'react';
import Settings from '../components/Settings';

type Props = {
  children: React.Node
};

export default class App extends React.Component<Props> {
  props: Props;

  render() {
    return (
      <div className="container">
        {this.props.children}
        <Settings/>
      </div>
    );
  }
}
