var assert = require("assert");
var fs = require("fs");

process.argv.forEach(function(arg) {
    if (!/\.json$/.test(arg)) {
        return;
    }

    var leds = JSON.parse(fs.readFileSync(arg, "utf8"));

    var lights = require("offgrid-lights");
    var camera = require("offgrid-camera");

    camera.switch();

    function doFrame() {
        lights.blank();

        camera.capture(function(image, w, h) {
            for (var i in leds) {
                var xy = leds[i];
                if (xy.length === 2) {
                    var rgba = image(xy[0], xy[1]).map(function(n) {
                        return (n > 20) ? n : 0;
                    });

                    lights.write(i, rgba[0], rgba[1], rgba[2]);
                }
            }

        });

        lights.send();

        setImmediate(doFrame);
    }

    setTimeout(doFrame, 2000);
});
