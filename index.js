var assert = require("assert");
var fs = require("fs");
var lights = require("offgrid-lights");
var camera = require("offgrid-camera");

var delaySecs = 5;
var ledCount = 100;
var stride = 5;
var threshold = 120*3;
var margin = 100;
var original = {};
var positions = [];

exports.start = function start() {
    lights.blank();
    for (var led = 0; led < ledCount; ++led) {
        lights.blue(led);
    }
    lights.send();

    console.log("calibration will begin in " + delaySecs + " seconds");

    setTimeout(function() {
        lights.blank().send();
        setTimeout(function() {
            tare();
            calibrateLoop();
        }, 1000);
    }, delaySecs * 1000);
};

function sum(rgba) {
    return rgba ? rgba[0] + rgba[1] + rgba[2] : 0;
}

function tare() {
    camera.capture(function(image, w, h) {
        for (var x = stride; x < w; x += stride)
            for (var y = stride; y < h; y += stride)
                original[x + "," + y] = sum(image(x, y));
    });
}

function avgPt() {
    var count = 0;
    var xSum = 0;
    var ySum = 0;
    var denominator = 0;

    camera.capture(function(image, w, h) {
        for (var x = stride; x < w; x += stride) {
            for (var y = stride; y < h; y += stride) {
                var xySum = sum(image(x, y));
                var origSum = original[x + "," + y];
                var diff = xySum - origSum;
                if (xySum > threshold && diff > margin) {
                    xSum += diff * x;
                    ySum += diff * y;
                    denominator += diff;
                    ++count;
                }
            }
        }
    });

    console.log(count, xSum, ySum, denominator);

    return (count > 5) && [
        Math.round(xSum / denominator),
        Math.round(ySum / denominator)
    ];
}

function calibrateLoop() {
    var led = 0;

    function calibrate() {
        var xy = avgPt();
        if (xy) {
            positions[led] = xy;
            console.log("led " + led + " located at position " +
                        xy[0] + "," + xy[1]);
        } else {
            positions[led] = 0;
        }

        if (++led < ledCount) {
            lights.blank().blue(led).send();
            setTimeout(calibrate, 20);
        } else {
            var fileName = "./positions" + Date.now() + ".json";

            require("fs").writeFile(
                fileName,
                JSON.stringify(positions),
                function(err) {
                    if (err) throw err;
                    console.log("positions written to " + fileName);
                }
            );
        }
    }

    lights.blank().blue(led).send();
    setTimeout(calibrate, 20);
}

if (!module.parent) {
    exports.start();
}
