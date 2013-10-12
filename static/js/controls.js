// show the user
$("#user-display").html(user);
// give client a name
user_con = user + "_controller";
// soccet connection and events
var socket = io.connect('https://'+window.location.hostname+':3000');
socket.on('connect', function(){
  console.log("Connected");
  socket.emit('subscribe', { user: user_con });
  socket.emit('init_controls', { user: user});
});
socket.on('playlists', function(data){
  console.log(data);
});
socket.on('songs', function(data){
  console.log(data);
});

$(document).ready(function(){
  $("#user-display").html(user);

  $("#play").click(function(){
    sendRequest("play", "state");
  });
  $("#next").click(function(){
    sendRequest("next", "state");
  });
  $("#prev").click(function(){
    sendRequest("prev", "state");
  });
});

function sendRequest(control, type){
  socket.emit("control", {control: type, value: control, user: user});
}