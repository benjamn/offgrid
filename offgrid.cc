#include "offgrid-lights.h"
#include <node.h>
#include <v8.h>

void init(v8::Local<v8::Object> exports) {
  init_lights(exports);
}

NODE_MODULE(offgrid, init);
