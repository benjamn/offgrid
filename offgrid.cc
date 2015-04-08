#include "offgrid-lights.h"
#include <node.h>
#include <v8.h>

extern "C" {
#include "raspicam/RaspiStill.h"
}



void init(v8::Local<v8::Object> exports) {
  init_lights(exports);

  const char *argv[] = {
    "raspistill",
    "--width", "1600",
    "--height", "1200",
    "--timeout", "10000",
    "--timelapse", "200",
    "-o", "test%04d.jpg"
  };

  raspistill_main(11, argv);
}

NODE_MODULE(offgrid, init);
