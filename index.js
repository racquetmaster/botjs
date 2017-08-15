console.log("Hello World!");

const sys = require('./system.js');

sys.wait(5000);
sys.screenshot(`${__dirname}\\data\\file.png`);
