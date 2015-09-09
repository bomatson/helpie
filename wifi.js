var wifi = require('wifi-cc3000');
var config = require("./config.json");
var allowedTimeouts = 0+config.allowedTimouts;

wifiManager = {
  connect: function connect(done) {
    console.log("Connecting to %s...", config.wifi.ssid)

    wifi.connect({
      security: config.wifi.security || 'wpa2'
      , ssid: config.wifi.ssid
      , password: config.wifi.password
      , timeout: config.wifi.timeout || 20
    });

    wifi.on('connect', done);
  }
  ,
  powerCycle: function powerCycle() {
    wifi.reset(function() {
      console.log('Reset called');
      allowedTimeouts = 0+config.allowedTimouts;
      setTimeout(function() {
        if (!wifi.isConnected()) {
          console.log('Wifi not connected, trying...');
          wifiManager.connect()
        }
      }, 20 * 1000);
    })
  }
};

module.exports = wifiManager;
