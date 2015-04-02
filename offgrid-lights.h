#include "elinux-tcl/tclled.h"
#include <v8.h>

void init_lights(v8::Local<v8::Object> exports);

class TCLData {
public:
  TCLData(int count);
 ~TCLData();

  void blank();
  void write(int led, uint8_t r, uint8_t g, uint8_t b);
  void red(int led);
  void green(int led);
  void blue(int led);
  void send();

private:
  int ledCount;
  int deviceFD;
  tcl_buffer buffer;
};
