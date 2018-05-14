# ListenMoe Electron

[Listen.moe](https://www.listen.moe) electron client for Windows / Mac / Linux

Based on [electron-react-boilerplate](https://github.com/chentsulin/electron-react-boilerplate)

## Supports:
... TODO

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
##### After downloading repository run Yarn
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
npm run dev
```
- Package release for Windows, Mac and Linux
```bash
npm run package-all
```

## Todo
- Handle network disconnect
- Color customization
- Music visualizer
- Window opacity
- Fix Linux icon
