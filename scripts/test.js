var fs = require("fs");
var lights = require("offgrid-lights");
var camera = require("offgrid-camera");
var dataFileName = "./data-daylight.json";

try {
  var data = require(dataFileName);
} catch (err) {
  data = [];
}

lights.blank().write(200, 100, 0, 0).send();

setTimeout(function () {
  camera.tare();
  
  setTimeout(function () {
    locate(0);
  }, 3000);
}, 5000);

function locate (led) {
  if (led >= 575) {
    console.log("ALL DONE");
    return;
  }

  if (data[led]) {
    locate(led + 1);
    return;
  }

  lights.blank().write(led, 100, 0, 0).send();

  setTimeout(function () {
    var found = camera.find(1, 0, 0);
    if (found) {
      found[0] = Math.round(found[0]);
      found[1] = Math.round(found[1]);
      console.log(led, data[led] = found);
      require("fs").writeFileSync(
        dataFileName,
        JSON.stringify(data)
      );
    } else {
      lights.blank().send();
    }

    locate(led + 1);
  }, 50);
}
