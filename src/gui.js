'use strict';

const $ = require('jquery');

function main_html(title) {
    return `
<link rel="stylesheet" type="text/css" href="base.css">
<style>
    .left {
        float: left;
        width: 20%;
    }

    .right {
        float: left;
        width: 80%;
    }
</style>
<div class="left">
    <h1>${title}</h1>
    <table id='cmds'>
        <tr>
            <th>Description</th>
            <th>Loop Time</th>
            <th>Run</th>
        </tr>
    </table>
    <div id="data"></div>
</div>
<div id="img" class="right"></div>`;
}


class GUI {
    init(title) {
        this.title = title;
        this._next_id = 0;
        this.render();
    }

    _get_id() {
        this._next_id += 1;
        return this._next_id;
    }


    render() {
        $('body').html(main_html(this.title));
    }

    add_cmd(key, text, fn) {
        let id = this._get_id();
        let row = `<tr>
        <td>${key}</td>
        <td>${text}</td>
        <td><button id="${id}">${key}</button></td>
        </tr>`;
        $('#cmds').append(row);
        globalShortcut.register(key, fn);
        $(`#${id}`).click(fn);
    }

    add_data(data) {
        $('#data').prepend(`${data}<br />`);
    }

    clear_data() {
        $('#data').html('');
    }

    show_img(img) {
        let url = img.toDataURL();
        $('#img').html(`<img style="width: 100%" src="${url}" />`);
    }
};

module.exports = new GUI();
