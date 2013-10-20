// page setup
var loadTime = new Date().getTime();
var logs = [];
// show the user
$("#user-display").html(user);
// soccet connection and events
var socket = io.connect('https://'+window.location.hostname+':3000');
socket.on('connect', function(){
  console.log("Connected");
  socket.emit('subscribe', { user: user });
});

socket.on('control', function (data) {
  time = new Date().getTime();
  diff = (time-loadTime)/1000.0;
  logs.push("["+diff.toFixed(3)+"s] New control event from server: " + JSON.stringify(data));
  $("#output").html(logs.join("\n"));
});