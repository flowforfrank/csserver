# CS:GO Server Starter CLI

![CS:GO Server Starter CLI](https://bit.ly/2X3eLFn)

## Prerequirements
- `npm install` (in administrator mode)

## Steps to run
- Run `CS Server.bat`
- Choose a game mode and a map
- Press shift after map is loaded in to access console again

### Notes
- Make sure Steam runs
- Enable console in CS Go
- Console shortcut must be on F2, alternatively you can change the `consoleShortcut` property inside `config.js`
- If the game fails to run, check the `rootPath` property inside `config.js`
- Add optional params inside `config.js`, they will be copied to the clipboard for you to paste into the console after the match starts

## Implementation

If you would like to read more about the implementation, the tutorial is available on [webtips.dev](https://www.webtips.dev/writing-a-server-starter-cli-for-csgo-with-javascript)
