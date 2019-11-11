const spawn     = require('child_process').spawn;
const robot     = require('robotjs');
const ncp       = require('copy-paste');
const fs        = require('fs');
const path      = require('path');
const terminal  = require('terminal-kit').terminal;
const settings  = require('./config.js');
const {
    selectedMenuItem,
    menuOptions
} = require('./menu.js');

const gameModes = [
    'Casual',
    'Competitive',
    'Arms Race',
    'DeathMatch',
    'Demolition',
    'Wingman'
];

const maps = {
    classic: [],
    workshop: []
};

const defaults = {};

const isMap = (file) => path.extname(file) === '.bsp';

let gameStartedBooting = false;
let gameInterval;

function setDefaults() {
    defaults.mapPath = `${settings.rootPath}\\csgo\\maps`;
    defaults.workshopMapPath = `${settings.rootPath}\\csgo\\maps\\workshop\\`;
    defaults.executablePath = `${settings.rootPath}\\csgo.exe`;
    defaults.screenSize = robot.getScreenSize();
};

function getMaps() {
    fs.readdirSync(defaults.mapPath).forEach(file => {
        if (isMap(file)) {
            const mapName = path.basename(file, '.bsp');

            maps.classic.push({
                mapName,
                mapPath: mapName
            });
        }
    });
};

function getWorkshopMaps() {
    fs.readdirSync(defaults.workshopMapPath).forEach(file => {
        fs.readdirSync(defaults.workshopMapPath + file).forEach(internal => {
            if (isMap(internal)) {
                const mapName = path.basename(internal, '.bsp');
                const mapPath =  `workshop\/${file}\/${mapName}`;

                maps.workshop.push({
                    mapName,
                    mapPath
                });

                maps.workshop.sort((a, b) => a.mapName > b.mapName ? 1 : -1);
            }
        });
    });
};

function selectMapAndGameMode() {
    selectGameMode('Competitive');
    selectedMenuItem.map = maps.classic[21];
};

function selectGameMode(gamemode) {
    switch (gamemode) {
        case 'Casual':      setMenuGameMode('Casual', 0, 0);      break;
        case 'Competitive': setMenuGameMode('Competitive', 1, 0); break;
        case 'Arms Race':   setMenuGameMode('Arms Race', 0, 1);   break;
        case 'DeathMatch':  setMenuGameMode('DeathMatch', 2, 1);  break;
        case 'Demolition':  setMenuGameMode('Demolition', 1, 1);  break;
        case 'Wingman':     setMenuGameMode('Wingman', 2, 0);     break;
        default:            setMenuGameMode('Competitive', 1, 0); break;
    }
};

function selectGameModeMenu() {
    terminal.singleColumnMenu(gameModes, { cancelable: true }, (error, response) => {
		selectGameMode(response.selectedText);
        mainMenu();
    });
};

function setMenuGameMode(name, mode, type) {
    selectedMenuItem.gameMode = {
        name,
        mode,
        type
    };
};

function refreshPage() {
    terminal.clear();
    terminal.white('Welcome to the CS Server Starter!\n\n');

    terminal.cyan('Selected gamemode: ');
    terminal.red(selectedMenuItem.gameMode.name + '\n');
    terminal.cyan('Selected map:\t   ');
    terminal.red(selectedMenuItem.map.mapName + '\n');
};

function mainMenu() {
    refreshPage();

    terminal.singleColumnMenu(menuOptions, (error, response) => {
        const selectedMenuItem = menuOptions[response.selectedIndex];

        switch (selectedMenuItem) {
            case 'Let\'s teach these dogs a lesson': letsTeachTheseDogsALesson(); break;
            case 'Game Mode':                        selectGameModeMenu();        break;
            case 'Classic maps':                     selectMap(false);            break;
            case 'Workshop maps':                    selectMap(true);             break;
            case 'Exit':                             process.exit();              break;

            default:
                terminal.red('Something wrong has happened... oh boy 😔')
                process.exit();

            break;
        }
    });
};

function selectMap(isWorkShopMap) {
    const menuItems = [];

    if (isWorkShopMap) {
        maps.workshop.forEach(map => {
            menuItems.push(map.mapName);
        });
    } else {
        maps.classic.forEach(map => {
            menuItems.push(map.mapName);
        });
    }

    terminal.gridMenu(menuItems, {cancelable: true}, (error, response) => {
        if (isWorkShopMap) {
            selectedMenuItem.map = maps.workshop[response.selectedIndex];
        } else {
            selectedMenuItem.map = maps.classic[response.selectedIndex];
        }

        mainMenu();
    });
};

function checkGameState() {
    const hex = robot.getPixelColor(0, defaults.screenSize.height / 2);

    const onLoadingScreen = hex === '000000';
    const onMainMenu      = hex !== '000000';

    if (!gameStartedBooting && onLoadingScreen) {
        terminal.white('Game booting up\n');
        gameStartedBooting = true;
    }

    if (gameStartedBooting && onMainMenu) {
        const mode = selectedMenuItem.gameMode.mode;
        const type = selectedMenuItem.gameMode.type;
        const map = selectedMenuItem.map.mapPath;
        
        terminal.green('Game loaded, starting server...');

        robot.setKeyboardDelay(500);
        robot.keyTap(settings.consoleShortcut);

        robot.typeString(`game_mode ${mode}`);
        robot.keyTap('enter');

        robot.typeString(`game_type ${type}`);
        robot.keyTap('enter');

        robot.typeString(`map ${map}`);
        robot.keyTap('enter');

        clearInterval(gameInterval);
    }
}

function letsTeachTheseDogsALesson() {
    ncp.copy(settings.optionalParams.join(';'));

    spawn(defaults.executablePath, ['-steam']);
    gameInterval = setInterval(checkGameState, 1000);

    terminal.white('\nUsing additional params:\n');
    terminal.cyan(` - ${settings.optionalParams.join('\n - ')}`);
    terminal.white('\n\ncopied additional params to clipboard\n\n');
}

function start() {
    setDefaults();
    getMaps();
    getWorkshopMaps();
    selectMapAndGameMode();
    mainMenu();
}

start();
