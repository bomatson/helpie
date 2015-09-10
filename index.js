var tessel = require('tessel');
var http = require('http');
var async = require('async');

var wifi = require('./wifi');
var pins = require('./pin');
var audio = require('./audio');

function toggleButton(value) {
  if (value == 0) {
    audio.startRecording();
  } else {
    audio.stopRecording(function(data) {
      console.log("finished recording", data);

      // web request
      http.get('http://google.com', function(request) {
        console.log("i got", request);
      })

      audio.play(data);
    });
  }
}

async.parallel([wifi.connect, audio.start], function() {
  pins.on('digital:0', 'change', toggleButton)
  pins.on('digital:1', 'change', toggleButton)
  pins.on('analog:0', 'change', function(value) {
    audio.setVolume(value);
  });
});

pins.start();
