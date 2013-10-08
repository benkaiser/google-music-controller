var express  = require('express.io');
var swig  = require('swig');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/googlemusic');

//*** DEFINED CONSTANTS ***//

ext = ""; // extension after the tld to run the server at. eg. '/hi', would run the server at localhost/hi/
port = 3000; // port to run on

//*** END CONSTANTS ***///

function Server(){
  var self = this;
  // create the app and connect to the database
  self.init = function(callback){
    // create the app and the routes
    self.app = express();
    self.app.http().io();
    self.createRoutes();
    // configure app to parse data
    self.app.configure(function(){
      self.app.use(express.cookieParser());
      self.app.use(express.bodyParser());
    });
    // static pages
    self.app.use("/static", express.static(__dirname + '/static'));
    // db connection
    self.app.db = mongoose.connection;
    self.app.db.on('error', console.error.bind(console, 'connection error:'));
    self.app.db.once('open', function() {
      self.setupSchema(callback);
    });

  }
  // setup the database schema
  self.setupSchema = function(callback){
    self.app.schema = {};
    self.app.models = {};
    self.app.schema.ControlLog = new Schema({
      email: String,
      control: String
    });
    self.app.models.ControlLog = mongoose.model('ControlLog', self.app.schema.ControlLog);
    callback();
  }
  // create all the routes for the server
  self.createRoutes = function(callback){
    self.app.get(ext + "/", function(req, res){
      res.send("Server is running.");
    });
    self.app.get(ext + "/:user/controls", function(req, res){
      user = req.params.user;
      res.send(swig.renderFile(__dirname + "/templates/controls.html", {user: user}));
    });
    self.app.get(ext + "/:user/:control", function(req, res){
      user = req.params.user;
      control = req.params.control;
      var newLog = new self.app.models.ControlLog({email: user, control: control});
      newLog.save(function(err){
        if(err){
          res.send({status: "error"});
        } else {
          // send the success
          res.send({status: "success"});
          // emit the socket
          self.app.io.sockets.in(user).emit('control', {control: control});
        }
      });
    });
    // api and socket functions
    self.app.io.sockets.on('connection', function(socket){
      socket.on('subscribe', function(data){
        console.log(data.user);
        socket.join(data.user);
      });
    });
    self.app.get(ext + "/:user/api/get", function(req, res){
      user = req.params.user;
      self.app.models.ControlLog.find({ email: user }, function(err, logs){
        if(err){
          res.send({status: "error"});
        } else {
          res.send({status: "success", data: logs});
          // delete all the logs when we have sent them down
          for (var i = logs.length - 1; i >= 0; i--) {
            logs[i].remove();
          };
        }
      });
    });
    // test function
    self.app.get(ext + "/:user/api/test", function(req, res){
      user = req.params.user;
      res.send(swig.renderFile(__dirname + "/templates/test.html", {user: user}));
    });
  }
  // start the server
  this.startServer = function(callback){
    self.app.listen(port, callback);
  }
}

// run the class
var s = new Server();
s.init(function(){
  s.startServer(function(){
    console.log("Server running!");
  });
});
