var tessel = require('tessel');
var http = require('http');
var async = require('async');

var wifi = require('./wifi');
var pins = require('./pin');
// var audio = require('./audio');
// 
// function buttonPressed() {
//   audio.startRecording();
// }
// 
// function buttonReleased() {
//   if (audio.recording == false) return;
//   audio.stopRecording(function(data) {
//     console.log("finished recording", data);
// 
//     http.get('http://google.com', function(request) {
//       console.log("i got", request);
//     })
// 
//     audio.play(data);
//   });
// }
// 
// 
// async.parallel([wifi.connect, audio.start], function() {
//   tessel.button.on('press', buttonPressed);
//   tessel.button.on('release', buttonReleased);
// });
// 
//

pins.on('digital:0', 'change', function(value) {
  console.log('button 1', value);
});


pins.on('digital:1', 'change', function(value) {
  console.log('button 2', value);
});

pins.on('analog:0', 'change', function(value) {
  console.log('potentiometer', value);
});

pins.start();
