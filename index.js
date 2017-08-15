let proc = process.argv[2];
switch(proc){
    case 'nms':
        require('./no_mans_sky/index.js');
        break;
    case 'test':
        const sys = require('./botjs/system.js');

        sys.wait(5000);
        sys.screenshot(`${__dirname}\\data\\file.png`);
        break;
    default:
        console.log("No sure which option");
        break;
}
