var lights = require("offgrid-lights");
var camera = require("offgrid-camera");

function blank() {
    return lights.blank();
}

blank().send();

setTimeout(function() {
    camera.tare();
    blank().blue(3).send();
    setImmediate(function() {
        var start = +new Date;
        console.log(camera.find(), new Date - start);
        lights.blank().send();
    });
}, 2000);
