"use strict";

const cp = require('child_process');
const path = require('path');

class Windows {
    constructor() {
        this.nircmd_path = path.join(__dirname, '..', 'bin', 'nircmd', 'nircmd.exe');
    }

    _cmd(args) {
        cp.execSync(`${this.nircmd_path} ${args}`);
    }

    screenshot(file) {
        this._cmd(`savescreenshot ${file}`);
    }

    click(x, y) {
        this._cmd(`setcursor ${x} ${y}`);
        this._cmd(`sendmouse left click`);
    }

    setcursor(x, y) {
        this._cmd(`setcursor ${x} ${y}`);
    }

    wait(time) {
        this._cmd(`wait ${time}`);
    }
}

module.exports = new Windows();
