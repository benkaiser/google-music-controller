$(document).ready(function(){
  $("#user-display").html(user);

  $("#play").click(function(){
    sendRequest("play");
  });
  $("#next").click(function(){
    sendRequest("next");
  });
  $("#prev").click(function(){
    sendRequest("prev");
  });
});

function sendRequest(control){
  $.ajax({
    url: control,
    success: function(data){
      console.log(data);
    }
  });
}