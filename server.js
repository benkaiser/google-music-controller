var express  = require('express.io');
var swig  = require('swig');
var fs = require('fs');
var gms = require(__dirname + '/google-music-server.js');

// https options
httpsOptions = {
    key: fs.readFileSync(__dirname + '/ssl/key'),
    cert: fs.readFileSync(__dirname + '/ssl/cert')
}

// run the class
var s = new gms.Server(httpsOptions, 3000);
s.init(function(){
  s.startServer(function(err){
    console.log("Server running!");
  });
});
