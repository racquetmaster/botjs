'use strict';
const path = require('path');
const $ = require('jquery');
const { remote } = require('electron');
const { app, Menu, MenuItem, globalShortcut } = remote;
const gui = require('../gui');
const win = require('../windows');


const DATA_DIR = path.join(__dirname, '..', '..', 'data');

const MULTI_TOOL_BAR = { x: 1449, y: 110 };

const BLACK = { r: 0, g: 0, b: 0, a: 255 };
const RED = { r: 255, g: 0, b: 0, a: 255 };


class NMS {
    constructor() {
        gui.init("No Man's Sky Bot")

        this.mining = new Runner(new Mining());
        this.asteroids = new Runner(new Asteroids());

        gui.add_cmd('ALT+O', 'Open NMS', () => this.open());
        gui.add_cmd('ALT+P', 'Take Screenshot (Picture)', () => this.screenshot());
        gui.add_cmd('ALT+W', "Toggle Mining", () => this.mining.toggle());
        gui.add_cmd('ALT+A', "Toggle Asteroid Mining", () => this.asteroids.toggle());
        gui.add_cmd('ALT+T', 'Test', () => this.test());
        gui.add_cmd('ALT+S', 'Stop All', () => {
            this.mining.stop();
        })
        gui.add_cmd('ALT+R', 'Restart', () => {
            app.relaunch();
            app.quit();
        });
    }

    /************** COMMANDS *****************/
    test() {
        // let screen = win.screen();
        // screen.set_pixel(MULTI_TOOL_BAR, BLACK);
        // this.gui.show_img(screen);
        // console.log("Testing");
        // win.nircmd(`beep 1000 250`);
        // let timer = new Timer();
        // for (let i = 1; i <= 100; i++) {
        //     win.screen();
        //     timer.elapsed(`Screen ${i}`);
        // }
        // timer.elapsed('100 screen reads');
        if (this._start_time) {
            console.log(Date.now() - this._start_time);
        } else {
            this._start_time = Date.now();
        }

    }

    screenshot() {
        let screen = win.screen();
        screen.to_file(path.join(DATA_DIR, `${Date.now()}.png`));
    }

    open() {
        win.cmd(`"D:\\SteamLibrary\\steamapps\\common\\No Man's Sky\\Binaries\\NMS.exe"`)
        win.nircmd(`wait 10000`);
        win.nircmd(`win center title "No Man's Sky"`);
    }
}

class Mining {
    start(runner) {
        runner.interval = 2000;
        win.nircmd(`sendmouse left down`);
    }
    tick() {
        let screen = win.screen();
        let dist = screen.color_distance(MULTI_TOOL_BAR, RED);
        if (dist < 150) {
            win.nircmd(`sendmouse left up`);
            win.nircmd(`wait 500`);
            win.nircmd(`sendmouse left down`);
            return 2000;
        } else {
            return 50;
        }
    }
    stop() {
        // win.nircmd(`beep 500 250`);
        win.nircmd(`sendmouse left up`);
    }
}

class Asteroids {
    start(runner) {
        runner.interval = 2000;
        win.nircmd(`sendmouse left down`);
    }
    tick() {
        let screen = win.screen();
        let dist = screen.color_distance(MULTI_TOOL_BAR, RED);
        if (dist < 150) {
            win.nircmd(`sendmouse left up`);
            win.nircmd(`wait 2500`);
            win.nircmd(`sendmouse left down`);
            return 2000;
        } else {
            return 50;
        }
    }
    stop() {
        // win.nircmd(`beep 500 250`);
        win.nircmd(`sendmouse left up`);
    }
}


//********* Runner *************/

class Runner {
    /**
     * Runner Constructor
     * @param  {object} logic Contains logic functions
     * @param  {function} logic.start Function called on start. Will pass in runner as first param.
     * @param  {function} logic.tick Function called on each tick. Can return interval to be used.
     * @param  {function} logic.stop Function called on stop.
     * @return {Runner}       Runner Object
     */
    constructor(logic) {
        this.logic = logic;
        this.interval = 1000;
        this._timer = null;
    }

    is_running() {
        return this._timer !== null;
    }

    start() {
        if (this._timer) return;
        if (this.logic.start) this.logic.start(this);
        this._timer = setTimeout(this.tick.bind(this), this.interval);
    }

    tick() {
        if (this.logic.tick) {
            let reply = parseInt(this.logic.tick());
            if (reply !== NaN) {
                this.interval = reply
            }
        }
        this._timer = setTimeout(this.tick.bind(this), this.interval);
    }

    run_once() {
        this.logic.start();
        this.logic.tick();
        this.logic.stop();
    }

    stop() {
        clearTimeout(this._timer);
        this._timer = null;
        this.logic.stop();
    }

    toggle() {
        if (this.is_running()) {
            this.stop();
        } else {
            this.start();
        }
    }
}

class Timer {
    constructor() {
        this._start = process.hrtime();
    }
    elapsed_sec() {
        let diff = process.hrtime(this._start);
        let elapsed = diff[0] + diff[1] / 1000000000;
        return elapsed;
    }
    elapsed(text) {
        let diff = process.hrtime(this._start);
        let elapsed = diff[0] + diff[1] / 1000000000;
        console.log(`${text} (${elapsed}s)`);
    }
}

$(document).ready(() => {
    window.app = new NMS();
});
