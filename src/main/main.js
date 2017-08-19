'use strict';
const { app, BrowserWindow, Menu } = require('electron')
const url = require('url');
const path = require('path');

let page = process.argv[2];
if (!page) {
    console.log("You must provide an option: nms");
    process.exit();
}

function create_win() {
    let win = new BrowserWindow({ width: 800, height: 600 });

    Menu.setApplicationMenu(null);

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
