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
import {app, BrowserWindow, dialog, globalShortcut, clipboard} from 'electron';
import MenuBuilder from './menu';
import Server from 'electron-rpc/server';
import {autoUpdater} from 'electron-updater';
import path from 'path';

const Config = require('electron-config');
const config = new Config();

let mainWindow = null;
let settingsWindow = null;

const log = require('electron-log');

function logger() {
  log.transports.file.level = 'info';
  log.transports.file.format = '{h}:{i}:{s}:{ms} {text}';
  log.transports.file.maxSize = 5 * 1024 * 1024;
}

logger();

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
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

const connectAutoUpdater = () => {
  log.info('Update check start');
  autoUpdater.autoDownload = false;
  autoUpdater.logger = log;
  autoUpdater.on('error', e => log.error(`update error ${e.message}`));
  autoUpdater.on('update-available', () => {
    log.info('Update is available');
    autoUpdater.downloadUpdate();
  });
  autoUpdater.on('checking-for-update', () => log.info('checking-for-update'));
  autoUpdater.on('update-not-available', () => log.info('update-not-available'));
  autoUpdater.on('download-progress', progressObj => {
    let msg = `Download speed: ${progressObj.bytesPerSecond}`;
    msg = `${msg} - Downloaded ${progressObj.percent}%`;
    msg = `${msg} (${progressObj.transferred}/${progressObj.total})`;
    log.info(msg);
  });
  autoUpdater.on('update-downloaded', () => {
    log.info('update-downloaded');
    const dialogOpts = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Application Update',
      detail: 'A new version has been downloaded. Restart the application to apply the updates.'
    };
    dialog.showMessageBox(dialogOpts, (response) => {
      if (response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  });
};

if (!isDebug) {
  connectAutoUpdater();
}

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

const doUpdateCheck = () => {
  if (!isDebug) {
    autoUpdater.checkForUpdates();
  }
};

app.on('ready', async () => {
  if (isDebug) {
    await installExtensions();
  }

  const previousBounds = config.get('windowBounds');

  let mainWindowConfig = {
    show: false,
    width: 500,
    height: isDebug ? 400 : 70,
    frame: isDebug,
    resizable: isDebug,
    maximizable: isDebug,
    fullscreenable: isDebug,
    title: 'Listen.moe',
  };

  if (previousBounds) {
    mainWindowConfig = {...mainWindowConfig, ...previousBounds};
  }

  mainWindow = new BrowserWindow(mainWindowConfig);

  const server = new Server();
  server.configure(mainWindow.webContents);
  globalShortcut.register('MediaPlayPause', () => server.send('media_play'));
  globalShortcut.register('MediaStop', () => server.send('media_play'));
  globalShortcut.register('MediaNextTrack', () => server.send('media_switch'));
  globalShortcut.register('MediaPreviousTrack', () => server.send('media_switch'));
  server.on('open_settings', openSettings);
  server.on('logged_in', (event) => server.send('user_logged_in', event.body));
  server.on('logged_out', () => server.send('user_logged_out'));
  server.on('copy_song_info', (event) => clipboard.writeText(event.body));

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
    mainWindow.focus();
    doUpdateCheck();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (settingsWindow) {
      settingsWindow.on('closed', () => settingsWindow = null);
      settingsWindow.close();
    }
    app.quit();
  });

  const menuBuilder = new MenuBuilder(mainWindow, doUpdateCheck);
  menuBuilder.buildMenu(server);
  mainWindow.closeApp = () => {
    config.set('windowBounds', mainWindow.getBounds());
    settingsWindow.on('closed', () => settingsWindow = null);
    settingsWindow.close();
    mainWindow.close();
    app.quit();
  };
  initSettings();
});
