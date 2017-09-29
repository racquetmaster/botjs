"use strict";

const cp = require('child_process');
const path = require('path');
const fs = require('fs');
const { clipboard, nativeImage } = require('electron');

const NIRCMD = path.join(__dirname, '..', 'bin', 'nircmd', 'nircmd.exe');

class Windows {
    constructor() {}

    cmd(args, { error = false } = {}) {
        try {
            cp.execSync(args);
        } catch (e) {
            if (error) {
                throw e;
            }
        }
    }

    nircmd(args) {
        cp.execSync(`${NIRCMD} ${args}`);
    }

    screen(filename) {
        // if (!filename) { filename = `${Date.now()}.jpg`; }
        // let file_path = path.join(this.data_dir, filename);

        this.nircmd(`savescreenshot *clipboard*`);

        return new Screen(clipboard.readImage());
    }

}


class Screen {
    constructor(image) {
        this._bitmap = image.toBitmap();
        this._size = image.getSize();
    }
    toDataURL() {
        return nativeImage.createFromBuffer(this._bitmap, this._size).toDataURL();
    }

    to_file(path) {
        let png = nativeImage.createFromBuffer(this._bitmap, this._size).toPNG();
        fs.writeFileSync(path, png);
    }

    _pixel_to_index(coords) {
        let i = (coords.y * this._size.width + coords.x) * 4;
        return i;
    }

    set_pixel(coords, color) {
        let i = this._pixel_to_index(coords);

        this._bitmap[i] = color.b; // blue
        this._bitmap[i + 1] = color.g; // green
        this._bitmap[i + 2] = color.r; // red
        this._bitmap[i + 3] = color.a || 255; // alpha
    }

    get_pixel(coords) {
        let i = this._pixel_to_index(coords);
        return {
            r: this._bitmap[i + 2],
            g: this._bitmap[i + 1],
            b: this._bitmap[i],
            a: this._bitmap[i + 3],
        };
    }
    color_distance(coords, expected) {
        let actual = this.get_pixel(coords);
        // console.log(expected);
        // console.log(actual);
        // console.log('-------');
        // console.log(Math.pow(expected.g - actual.g));
        let distance = Math.sqrt(Math.pow(expected.r - actual.r, 2) + Math.pow(expected.g - actual.g, 2) + Math.pow(expected.b - actual.b, 2));

        return distance;
    }
}



module.exports = new Windows();
