/**
 * Modify the rootPath and consoleShortcut to match your settings.
 * If you wish to add additional params to the game, you can do so in optionalParams, these will be copied to your clipboard
 */
module.exports = {
    rootPath: 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\Counter-Strike Global Offensive', // Your CS:GO root path
    consoleShortcut: 'f2', // Set this to the button that you use to open the console in CS:GO

    // params to set in CS:GO
    optionalParams: [
        'mp_friendlyfire 1',
        'mp_solid_teammates 2',
        'mp_freezetime 5',
        'mp_autoteambalance 0'
    ]
};