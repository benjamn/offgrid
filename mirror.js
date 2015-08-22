var lights = require("offgrid-lights");
var camera = require("offgrid-camera");

console.log(camera.width(), camera.height());

var data = require("./leds.json");

var xMax = data.reduce(function (max, xy) {
  return Math.max(xy[0], max);
}, 0);

camera.setData(data.map(function (xy) {
  return [xMax - xy[0], xy[1]];
}));

var beliefs = [];
var tolerance = 40;

function distance(a, b) {
  var sum = 0;

  var max = Math.min(a.length, b.length);
  for (var i = 0; i < max; ++i) {
    sum += Math.pow(a[i] - b[i], 2);
  }

  return Math.sqrt(sum);
}

function increaseConfidence(belief) {
  if (belief[3] < 50) {
    ++belief[3];
  }
}

function decreaseConfidence(belief) {
  if (belief[3] > 0) {
    --belief[3];
  }
}

function sample() {
  var start = +new Date;

  camera.sample().forEach(function (rgb, i) {
    if (i in beliefs) {
      var maxConfidence = 0;
      var maxBelief;

      var leastDistance = Infinity;
      var closestBelief;

      beliefs[i].forEach(function (belief) {
        if (belief[3] > maxConfidence) {
          maxConfidence = belief[3];
          maxBelief = belief;
        }

        var d = distance(rgb, belief);
        if (d < leastDistance) {
          leastDistance = d;
          closestBelief = belief;
        }
      });

      if (maxBelief) {
        var d = distance(rgb, maxBelief);
        if (d > tolerance) {
          lights.write(i, 0, 100, 0);

          decreaseConfidence(maxBelief);

          if (closestBelief && leastDistance < 10) {
            // TODO Average?
            increaseConfidence(closestBelief);
          } else {
            var newBelief = rgb.concat(0);
            beliefs[i].push(newBelief);
            increaseConfidence(newBelief);
          }

        } else {
          lights.write(i, 0, 0, 50);
          increaseConfidence(maxBelief);
        }
      }
    } else {
      beliefs[i] = [rgb.concat(10)];
    }
  });

  lights.send();

  setTimeout(sample, 0);
}

setTimeout(sample, 5000);
