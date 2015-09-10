var tessel = require('tessel');
var audio = require('audio-vs1053b').use(tessel.port['A']);

var audioManager = {
  ready: false,
  recording: false,
  buffer: [],
};

audioManager.start = function(done) {
  audio.on('data', function(data) {
    console.log('audio data');
    audioManager.buffer.push(data);
  });

  audio.on('ready', function() {
    console.log('audio ready');
    audioManager.ready = true;
    done()
  });

  audio.on('error', function(err) {
    console.log('audio error');
    throw err;
  });
}

audioManager.startRecording = function() {
  if (audioManager.recording) return;
  audioManager.recording = true;

  audio.startRecording('voice', function() {
    console.log('audio start');
    tessel.led[0].output(1);
  });
}

audioManager.stopRecording = function(done) {
  if (!audioManager.recording) return;
  console.log('audio stop');
  audioManager.recording = false;
  audio.stopRecording(function() {
    tessel.led[0].output(0);
    var data = Buffer.concat(audioManager.buffer);
    audioManager.buffer = [];
    done(data);
  });
}

audioManager.play = function(data) {
  audio.play(data);
}

audioManager.setVolume = function(newVal, callback) {
  audio.setVolume(newVal, callback);
}

module.exports = audioManager;
