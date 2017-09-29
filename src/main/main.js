'use strict';
const electron = require('electron');
const { app, BrowserWindow, Menu } = electron;
const url = require('url');
const path = require('path');

let page = process.argv[2];
if (!page) {
    console.log("You must provide an option: nms");
    process.exit();
}

function create_win() {
    let { width, height } = electron.screen.getPrimaryDisplay().workAreaSize
    let win = new BrowserWindow({ width, height });

    let menu_template = [{
        label: 'Window',
        submenu: [
            { role: 'toggledevtools' },
        ]
    }];
    Menu.setApplicationMenu(Menu.buildFromTemplate(menu_template));

    let u = url.format({
        pathname: path.join(__dirname, '..', 'pages', `${page}.html`),
        protocol: 'file:',
        slashes: true
    });

    win.loadURL(u);
}


app.on('ready', create_win);

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
})

module.exports = {};
