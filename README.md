# ListenMoe Electron

[Listen.moe](https://www.listen.moe) electron client for Windows / Mac / Linux

![App](./docs/app.jpg)

Based on [electron-react-boilerplate](https://github.com/chentsulin/electron-react-boilerplate)

## Supports:
- Listen to both JP and KR stream
- Connect with Listen.moe account to manage favourites <i>(in settings)</i>
- Play / pause / switch stream with media keys
- Auto updates
- Scroll to change volume
- Right click to copy song info <i>(In format: "Artist SongName")</i>

Because of how dragging and mouse events work in Electron half of the app is draggable and the other half supports 
mouse events.
<br/>Left side of the app lets you move it around the screen.
<br/>Right side supports volume change by scroll, right click to copy song info, other icons clicks.

These regions are highlighted on the picture bellow. Blue is for drag and orange is for other mouse events.

![Mouse](./docs/mouse.jpg)

I'll try to fix this in the future.

## Instructions
##### [Download](https://github.com/aklein13/listen-moe-electron/releases/latest) latest release for your platform
### Windows
1. Download <i>listen-moe-electron-setup-x.x.x.exe</i>
2. Install it
### Mac
1. Download <i>ListenMoe-x.x.x.dmg</i>
2. Run and drag it to your Applications
### Linux
1. Download <i>listen-moe-electron-x.x.x-x86_64.AppImage</i>
2. Right click on it
3. Go to Properties and then Permissions
4. Check <i>Allow executing file as program</i>

Or you can just `chmod +x` it.

## Dev Instruction:
##### After downloading repository run [Yarn](https://yarnpkg.com/)
```bash
$ yarn
```
##### Then you can use one of the following commands:
- Run in dev environment
```bash
npm run dev
```
- Package release for your current platform
```bash
npm run package
```
- Package release for Windows, Mac and Linux
```bash
npm run package-all
```

## Todo
- Color customization
- Music visualizer
- Window opacity
- Fix Linux icon
- Something with drag and scroll mouse events
