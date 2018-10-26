/* flowtype-errors/show-errors: 0 */

/**
 * @flow
 */

import {app, BrowserWindow, dialog, globalShortcut, clipboard, nativeImage} from 'electron';
import MenuBuilder from './menu';
import Server from 'electron-rpc/server';
import {autoUpdater} from 'electron-updater';
import path from 'path';

const Config = require('electron-config');
const config = new Config();

let mainWindow = null;
let settingsWindow = null;

const log = require('electron-log');

const playIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4gYEEw00HQDlDwAAAOpJREFUSMe11cEqxGEUhvHzN5OlKEuLKTfAwhXMio2dO7BgmpJbkJWNUjazsnEPNBtrKQuixAVMzcJGEn5WX5QFU995LuB7Ol/nvG9ERKCHR2yiFbXBlW9usFpbcO03QyxlCuADJ1jIEhResI+ZLEFhhG20swSFe6xnCgoXWMkUwCdO0ckSFF5xgNksQWGMHUxnCQqDiIipyGMUEdFOePg5IvYi4qj2F73jGPM/bbUmOI+I3aZpbmuv6R3WMg5tjP6/M2kCwRsOMVc77EocLGbE9RmWMwrnEt2M0n/ABpqapd/DE7Ymbqs/+AK1dfn3LQ3u0QAAAABJRU5ErkJggg==';
const pauseIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4gYEEw0bttHYVgAAAEJJREFUSMftzbEJACAQQ9HE/ZcRFNwu9odgGsEivzwuPEgaurdQcneUJBiRZAGsXcPjAgQIECBAgAD/AN34m4ebtduLqlmCeznqLwAAAABJRU5ErkJggg==';

const isWindows = process.platform === 'win32';

// const appIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAEDElEQVR4nO3dPWpUURiA4S8hBJFUktpVWFlkJcHa2kKsxMolWFi7DJcgLsIqtYiEFBmLTBHSmB9m7gzv88Dhlueb5r2cKe45WK1WBwMkHS49ALAcAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYCwo6UHuOPLzLydmav14v9OZubnzLxaehD2z64F4Nn6ebxe3M/J0gOwnxwBIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIGzXbgbapouZ+TE3txHtcwhP5+ZqMHiwcgC+z8ybpYeAJe3zmw94IgGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAsPJHQeHG4fmnmfk4M782uMvxzDyfma9z/e39Bvd5EAGAmRfr58st7HW6hT3uzREAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwo6WHuCOy/Xzar025eTWXpC1awF4NzMfZuZ6w/sczmYDA3th1wJwOd7MsDX+A4AwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYCwXfsmIPvi8PzzzJzNzMXSozzR77n5HUkCwGOdzczrpYfgaRwBIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIMzNQDzW3/Xzz6JT7I/j9bpcepDbDlar1cHSQwDLcASAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAsH/bWiSVAY5ilwAAAABJRU5ErkJggg==';

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
    height: 250,
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

const closeApp = () => {
  config.set('windowBounds', mainWindow.getBounds());
  settingsWindow.on('closed', () => settingsWindow = null);
  settingsWindow.close();
  mainWindow.close();
  app.quit();
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

  // if (process.platform === 'linux') {
  //   mainWindowConfig.icon = nativeImage.createFromDataURL(appIcon);
  // }

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
  server.on('color_change', (event) => server.send('color_changed', event.body));
  server.on('logged_out', () => server.send('user_logged_out'));
  server.on('copy_song_info', (event) => clipboard.writeText(event.body));
  server.on('close_app', closeApp);

  let wasPlayRequested = false;

  if (isWindows) {
    server.on('player_change', (event) => setThumbarIcons(event.body));
  }

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  const setThumbarIcons = (isPlaying, force) => {
    // Prevent setting icon before window has loaded (from auto play)
    if (!force && !wasPlayRequested) {
      return wasPlayRequested = true;
    }
    wasPlayRequested = true;
    mainWindow.setThumbarButtons([
      {
        tooltip: isPlaying ? 'Pause' : 'Play',
        icon: nativeImage.createFromDataURL(isPlaying ? pauseIcon : playIcon),
        click: () => server.send('media_play'),
      },
    ]);
  };

  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
    mainWindow.focus();
    if (isWindows) {
      setThumbarIcons(wasPlayRequested, true);
    }
    if (!isDebug) {
      autoUpdater.checkForUpdates();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (settingsWindow) {
      settingsWindow.on('closed', () => settingsWindow = null);
      settingsWindow.close();
    }
    app.quit();
  });

  // Mac dark mode... It looks better for settings but worse for the player itself...
  // if (systemPreferences.isDarkMode) {
  //   systemPreferences.setAppLevelAppearance('dark');
  // }

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu(server);
  initSettings();
});
