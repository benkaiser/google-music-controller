$(document).ready(function(){
  // get the user
  user = $(".gbps2").html();
  // soccet connection and events
  var socket = io.connect('//localhost:3000/');
  socket.on('connect', function () {
    console.log("connected!");
  });
  socket.emit('subscribe', { user: user });
  socket.on('control', function (data) {
    // execute control
    if(data.control == "play"){
      $("[data-id='play-pause']").click();
    } else if (data.control == "prev"){

    } else if (data.control == "next"){

    }
  });
});