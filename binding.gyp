{
  "targets": [{
    "target_name": "offgrid",
    "sources": [
      "elinux-tcl/tclled.cc",
      "offgrid-lights.cc",
      "offgrid.cc"
    ],
    "defines": ['SPIFILE="/dev/spidev0.0"'],
    "include_dirs": [
      "/opt/vc/include",
      "/opt/vc/include/interface/vcos/pthreads",
      "/opt/vc/include/interface/vmcs_host/linux"
    ],
    "libraries": [
      "-L/opt/vc/lib",
      "-lmmal",
      "-lvcos",
      "-lbcm_host",
      "-lGLESv2",
      "-lEGL",
      "-lm"
    ]
  }]
}
