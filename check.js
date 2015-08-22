var canvas = document.getElementsByTagName("canvas").item(0);
var context = canvas.getContext("2d");

canvas.width = 1600;
canvas.height = 1200;
    
var background = new Image;
background.src = "daylight.jpg";

background.onload = function () {
  // context.drawImage(background, 0, 0);

  var led = 0;
  document.addEventListener("keypress", function(event) {
    if (event.charCode === 32) { // spacebar
      var xy = data[led];
      console.log(led, xy);
      ++led;

      context.fillStyle = "lightgreen";
      context.beginPath();
      context.arc(xy[0] + 7, canvas.height - (xy[1] - 5), 2, 0, 2 * Math.PI);
      context.fill();
    }
  });
};
