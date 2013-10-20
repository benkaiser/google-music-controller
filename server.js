var express  = require('express.io');
var swig  = require('swig');
var fs = require('fs');
var gms = require(__dirname + '/google-music-server.js');

// https options
httpsOptions = {
    key: fs.readFileSync(__dirname + '/ssl/key'),
    cert: fs.readFileSync(__dirname + '/ssl/cert')
}

app = express();
app.https(httpsOptions).io();

app.configure(function(){
  app.use(express.cookieParser());
  app.use(express.bodyParser());
});

port = 3000;

// run the module
var s = new gms.Server(app);
s.init(function(){
  app.listen(port, function(){
    console.log("server is running");
  });
});
