var tessel = require('tessel');
//var http = require('http');
var async = require('async');
//var streamifier = require('streamifier');

var request = require('request');
var stream = require('stream');

var wifi = require('./wifi');
var pins = require('./pin');
var audio = require('./audio');

function toggleButton(value) {
  console.log("button hit",value);
  if (value == 0) {
    audio.startRecording();
  } else {
    audio.stopRecording(function(data) {
      console.log("finished recording");

      var options = {
        host: '2002fd7a.ngrok.io',
        port: 80,
        path: '/checkins',
        method: 'POST',
        headers: {
          'location': 'San Fran'
        },
        encoding: null
      }

      var req = request.post('http://2002fd7a.ngrok.io/checkins');

      var stream = streamifier.createReadStream(data);
      var bufferStream = new stream.PassThrough();
      bufferStream.end(data);
      bufferStream.pipe(req);

      req.on('response', function(response) {
        console.log(response);
      });

      console.log('asdf');

      /* audio.play(data); */
    });
  }
}

tessel.button.on('press', wifi.powerCycle);

async.parallel([audio.start], function() {
  console.log('running the last fun')
  pins.on('digital:0', 'change', toggleButton)
  pins.on('digital:1', 'change', toggleButton)
  pins.on('analog:0', 'change', function(value) {
    audio.setVolume(value);
  });
});

pins.start();
