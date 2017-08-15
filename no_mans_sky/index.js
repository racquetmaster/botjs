"use strict"

const express = require('express');
const path = require('path');





class NMS {
    constructor(){
        this._app = this._setup_express();
    }

    _setup_express(){
        let app = express();

        app.get('/', function(req, res){
            res.sendFile(path.join(__dirname, 'client.html'));
        });
        app.post('/start', function(req, res){
            this.start();
        });

        app.post('/stop', function(req, res){
            this.stop();
        });
        return app;
    }

    listen(){
        this._app.listen(3000);
    }

    start(){

    }

    stop(){

    }
}
