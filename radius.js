var lights = require("offgrid-lights");
var data = require("./leds.json");
var radius = 100;

console.log(process.argv);

var cx = 0, cy = 0;
data.forEach(function (xy) {
  cx += xy[0];
  cy += xy[1];
});
cx /= data.length;
cy /= data.length;

var velocity = 200;
var acceleration = 0.1;
var angle = 0;

var dx = 0;
var dy = 0;

function draw(radius, offset) {
  data.forEach(function (xy, i) {
    var x = xy[0];
    var y = xy[1];
    var dist =
      Math.sqrt(Math.pow(x - cx + dx, 2) +
		Math.pow(y - cy + dy, 2));

    var remainder = Math.abs(
      Math.round((dist + offset) / radius) % 3
    );

    switch (remainder) {
    case 0: lights.write(i, 0, 50, 0); break;
    case 1: lights.write(i, 25, 0, 25); break;
    case 2: lights.write(i, 0, 0, 50); break;
    }
  });

  dx = Math.sin(angle) * velocity;
  dy = Math.cos(angle) * velocity * 1.5;
  angle += 0.05;

  lights.send();
}

function loop(i) {
  draw(100, i);

  setTimeout(function () {
    loop(i - 5);
  }, 16);
}

loop(0);
