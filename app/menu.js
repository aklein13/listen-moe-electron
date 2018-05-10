// @flow
import {app, Menu, shell, BrowserWindow} from 'electron';

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu() {
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
      this.setupDevelopmentEnvironment();
    }

    const template = process.platform === 'darwin'
      ? this.buildDarwinTemplate()
      : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
    return menu;
  }

  setupDevelopmentEnvironment() {
    this.mainWindow.openDevTools();
    this.mainWindow.webContents.on('context-menu', (e, props) => {
      const {x, y} = props;

      Menu
        .buildFromTemplate([{
          label: 'Inspect element',
          click: () => {
            this.mainWindow.inspectElement(x, y);
          }
        }])
        .popup(this.mainWindow);
    });
  }

  buildDarwinTemplate() {
    const subMenuAbout = {
      label: 'ListenMoe',
      submenu: [
        {
          label: 'About', click() {
            shell.openExternal('https://github.com/aklein13/listen-moe-electron/');
          }
        },
        {type: 'separator'},
        {label: 'Services', submenu: []},
        {type: 'separator'},
        {label: 'Hide ElectronReact', accelerator: 'Command+H', selector: 'hide:'},
        {label: 'Hide Others', accelerator: 'Command+Shift+H', selector: 'hideOtherApplications:'},
        {label: 'Show All', selector: 'unhideAllApplications:'},
        {type: 'separator'},
        {
          label: 'Quit', accelerator: 'Command+Q', click: () => {
            app.quit();
          }
        }
      ]
    };

    return [
      subMenuAbout,
    ];
  }

  buildDefaultTemplate() {
    return [{
      label: '&File',
      submenu: [{
        label: '&Open',
        accelerator: 'Ctrl+O'
      }, {
        label: '&Close',
        accelerator: 'Ctrl+W',
        click: () => {
          this.mainWindow.close();
        }
      }]
    },
    ];
  }
}
