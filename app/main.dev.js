/* flowtype-errors/show-errors: 0 */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import {app, BrowserWindow, globalShortcut} from 'electron';
import MenuBuilder from './menu';
import Server from 'electron-rpc/server';

let mainWindow = null;
let settingsWindow = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
  const path = require('path');
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS',
  ];

  return Promise
    .all(extensions.map(name => installer.default(installer[name], forceDownload)))
    .catch(console.log);
};

app.on('window-all-closed', () => app.quit());

const initSettings = () => {
  settingsWindow = new BrowserWindow({
    show: false,
    width: 500,
    height: 300,
    resizable: isDebug,
    maximizable: isDebug,
    fullscreenable: isDebug,
    title: 'Settings',
  });
  settingsWindow.loadURL(`file://${__dirname}/app.html#/settings`);
};

const openSettings = () => {
  settingsWindow.show();
  settingsWindow.focus();
  settingsWindow.on('closed', initSettings);
};

app.on('ready', async () => {
  if (isDebug) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 500,
    height: isDebug ? 400 : 70,
    frame: isDebug,
    resizable: isDebug,
    maximizable: isDebug,
    fullscreenable: isDebug,
    title: 'Listen.moe',
  });

  const server = new Server();
  server.configure(mainWindow.webContents);
  globalShortcut.register('MediaPlayPause', () => server.send('media_play'));
  globalShortcut.register('MediaStop', () => server.send('media_play'));
  globalShortcut.register('MediaNextTrack', () => server.send('media_switch'));
  globalShortcut.register('MediaPreviousTrack', () => server.send('media_switch'));
  server.on('open_settings', openSettings);

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (settingsWindow) {
      settingsWindow.on('closed', () => settingsWindow = null);
      settingsWindow.close();
    }
    app.quit();
  });

  const menuBuilder = new MenuBuilder(mainWindow, settingsWindow);
  menuBuilder.buildMenu();
  mainWindow.closeApp = () => {
    settingsWindow.on('closed', () => settingsWindow = null);
    settingsWindow.close();
    mainWindow.close();
    app.quit();
  };
  initSettings();
});
