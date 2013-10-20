var express  = require('express.io');
var swig  = require('swig');
var fs = require('fs');

exports.Server = function(httpsOptions, port, ext){
  var self = this;
  self.httpsOptions = httpsOptions || {};
  self.port = port || 3000;
  self.ext = ext || "";
  // create the app and connect to the database
  self.init = function(callback){
    // create the app and the routes
    self.app = express();
    self.app.https(self.httpsOptions).io();

    self.createRoutes();
    // configure app to parse data
    self.app.configure(function(){
      self.app.use(express.cookieParser());
      self.app.use(express.bodyParser());
    });
    // static pages
    self.app.use("/static", express.static(__dirname + '/static'));
    callback();
  }
  // create all the routes for the server
  self.createRoutes = function(callback){
    self.app.get(self.ext + "/", function(req, res){
      res.send("Server is running.");
    });
    self.app.get(self.ext + "/:user/controls", function(req, res){
      user = req.params.user;
      res.send(swig.renderFile(__dirname + "/templates/controls.html", {user: user}));
    });
    self.app.get(self.ext + "/:user/:control", function(req, res){
      user = req.params.user;
      control = req.params.control;    
      // send the success
      res.send({status: "success"});
      // emit the socket
      self.app.io.sockets.in(user).emit('control', {control: control});
    });
    // api and socket functions
    self.app.io.sockets.on('connection', function(socket){
      socket.on('subscribe', function(data){
        socket.join(data.user);
      });
      // recieve from controller
      socket.on('control', function(data){
        self.app.io.sockets.in(data.user).emit('control', data);
      });
      socket.on('init_controls', function(data){
        self.app.io.sockets.in(data.user).emit('get_playlists', {});
      });
      // recieve from client
      socket.on('playlists', function(data){
        self.app.io.sockets.in(data.user + "_controller").emit('playlists', data);
      });
      socket.on('songs', function(data){
        self.app.io.sockets.in(data.user + "_controller").emit('songs', data);        
      });
    });
    // test function
    self.app.get(self.ext + "/:user/api/test", function(req, res){
      user = req.params.user;
      res.send(swig.renderFile(__dirname + "/templates/test.html", {user: user}));
    });
  }
  // start the server
  this.startServer = function(callback){
    // run the https server for io
    self.app.listen(self.port, callback);
  }
}