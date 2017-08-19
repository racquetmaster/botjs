'use strict';
const $ = require('jquery');
const { remote } = require('electron');
const { Menu, MenuItem, globalShortcut } = remote;

let sys = require('../system');

class NMS {
    constructor() {
        this._show_menu();

        // shortcuts
        globalShortcut.register('Alt+S', this.test.bind(this));
    }

    _show_menu() {
        let menu_template = [{
            label: 'Window',
            submenu: [
                { role: 'toggledevtools' },
            ]
        }];
        Menu.setApplicationMenu(Menu.buildFromTemplate(menu_template));
    }

    test() {
        console.log('Testing!');
        sys.setcursor(10, 10);
    }
}

$(document).ready(() => {
    window.app = new NMS();
});
