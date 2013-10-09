$(document).ready(function(){
  // get the user
  user = $(".gbps2").html();
  url = "https://localhost:3000/";
  // controls url
  con_url = url + user + "/controls";
  $("<p class='con_url'>Control your server at "+con_url+"</p>").prependTo("#action_bar_container");
  // soccet connection and events
  var socket = io.connect(url);
  socket.on('connect', function () {
    console.log("Connected and recieving as user: " + user);
    socket.emit('subscribe', { user: user });
  });
  socket.on('control', function (data) {
    // execute control
    if(data.control == "play"){
      $("[data-id='play-pause']").click();
    } else if (data.control == "prev"){
      $("[data-id='rewind']").click();
    } else if (data.control == "next"){
      $("[data-id='forward']").click();
    }
  });
});