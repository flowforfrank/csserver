const selectedMenuItem = {
    gameMode: {
        name: 'Competitive',
        type: 0,
        mode: 0
    },
    map: {
        mapName: '',
        mapPath: ''
    }
};

const menuOptions = [
    'Let\'s teach these dogs a lesson',
    'Game Mode',
    'Classic maps',
    'Workshop maps',
    'Exit'
];

module.exports = {
    selectedMenuItem,
    menuOptions
};
