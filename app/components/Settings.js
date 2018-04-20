import React, {Component} from 'react';

const {BrowserWindow} = window.require('electron').remote;
let mainWindow;
setTimeout(() => mainWindow = BrowserWindow.getFocusedWindow(), 1000);

export default class Settings extends Component {
  render() {
    return (
      <div className="settings">
        <div className="fa fa-close" onClick={() => mainWindow.close()}/>
        <div className="fa fa-gear"/>
        <div/>
      </div>
    );
  }
}
