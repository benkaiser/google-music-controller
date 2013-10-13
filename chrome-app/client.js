var socket = null;

$(document).ready(function(){
  // get the user
  user = $(".gbps2").html();
  // secure url for socket connect, use should go to http so they don't get scary warning
  sec_url = "https://localhost:3000/";
  url = "http://localhost:3001/";
  // controls url
  con_url = url + user + "/controls";
  $("<p class='con_url'>Control your server at "+con_url+"</p>").prependTo("#action_bar_container");
  // soccet connection and events
  socket = io.connect(sec_url);
  socket.on('connect', function () {
    console.log("Connected and recieving as user: " + user);
    socket.emit('subscribe', { user: user });
  });
  socket.on('control', function (data) {
    // execute control
    if(data.control == "state"){
      if(data.value == "play"){
        $("[data-id='play-pause']").click();
      } else if (data.value == "prev"){
        $("[data-id='rewind']").click();
      } else if (data.value == "next"){
        $("[data-id='forward']").click();
      }
    } else if (data.control == "playlist"){
      $("[data-id='" + data.value + "']").click();
      setTimeout(send_songs, 1000);
    } else if (data.control == "song"){
      play_song(data.value);
      
    }
    console.log(data);
  });
  socket.on('get_playlists', send_playlists);
  socket.on('get_songs', send_songs);
});

// playlist functions
function send_playlists(){
  playlists = get_playlists();
  socket.emit('playlists', {user: user, playlists: playlists});
  send_songs();
}
function get_playlists(){
  data = [];
  $("#playlists > li").each(function(){
    var item = {
      name: $(this).find(':nth-child(2)').html(),
      id: $(this).attr('id')
    };
    data.push(item);
  });
  return data;
}
// song list functions
function send_songs(){
  songs = get_songs();
  socket.emit('songs', {user: user, songs: songs});
}
function get_songs(){
  data = [];
  $(".song-table tbody > tr").each(function(){
    data.push(get_song_info($(this)));
  });
  return data;
}
function get_song_info(item){
  return {
    id: item.attr('data-id'),
    title: item.children("[data-col='title']").text(),
    duration: item.children("[data-col='duration']").text(),
    artist: item.children("[data-col='artist']").text(),
    album: item.children("[data-col='album']").text(),
    play_count: item.children("[data-col='play-count']").text()
  };
}

// page control
function play_song(id){
  // grab the element
  song_tr = $("[data-id='" + id + "']");
  // make the button to be clicked
  song_tr.find('span').first().prepend("<div class='hover-button tmp_click' data-id='play'></div>");
  // click the button
  $(".tmp_click").click();
  // remove the button
  $(".tmp_click").remove();
}