var tessel = require('tessel');
var gpio = tessel.port['GPIO'];
var emitter = require('events').EventEmitter;

var pinHandler = {
  registers: {},
};

pinHandler.on = function(pin, event, callback) {
  var parsed = pin.split(':');
  var register = parsed[0];
  var id = parsed[1];

  if (pinHandler.registers[register] == undefined) {
    pinHandler.registers[register] = {};
  }
  if (pinHandler.registers[register][id] == undefined) {
    var pin = new emitter();
    pin.value = pinHandler.read(register, id);
    pin.on(event, callback)
    pinHandler.registers[register][id] = pin;
  }
};

pinHandler.poll = function() {
  for (var register in pinHandler.registers) {
     var pins = pinHandler.registers[register];
     for (var id in pins) {
      var pin = pins[id];
      var value = pinHandler.read(register, id);
      if (pin.value != value) pin.emit('change', value);
      pin.value = value;
    }
  }
}

pinHandler.read = function(register, id) {
  return gpio[register][id].read();
}

pinHandler.start = function() {
  setInterval(pinHandler.poll, 100);
}

module.exports = pinHandler;
