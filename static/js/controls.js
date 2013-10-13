// Data Controls
var playlists = [];
var songs = [];
// show the user
$("#user-display").html(user);
// give client a name
user_con = user + "_controller";
// soccet connection and events
var socket = io.connect('https://'+window.location.hostname+':3000');
socket.on('connect', function(){
  socket.emit('subscribe', { user: user_con });
  socket.emit('init_controls', { user: user});
});
socket.on('playlists', function(data){
  playlists = data.playlists;
  playlistView = new PlaylistView();
  PlayMusicControllerApp.playlist_region.show(playlistView);
});
socket.on('songs', function(data){
  console.log(data);
  songs = data.songs;
  songView = new SongView();
  PlayMusicControllerApp.song_region.show(songView);
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
  $(".fixed_refresh").click(function(){
    socket.emit('init_controls', { user: user});
  });
});

function sendRequest(control, type){
  socket.emit("control", {control: type, value: control, user: user});
}


// View Controls
PlayMusicControllerApp = new Backbone.Marionette.Application();

PlayMusicControllerApp.addRegions({
  playlist_region: "#playlist_block",
  song_region: "#song_block"
});

PlayMusicControllerApp.addInitializer(function(options){
  Backbone.history.start();
});

var PlaylistView = Backbone.View.extend({
  template: "#playlist_template",
  render: function(){
    this.$el.html(render(this.template, {data: playlists}));
  },
  events: {
    "click .playlist_btn": "playlist_clicked"
  },
  playlist_clicked: function(event){
    id = $(event.currentTarget).attr("data-id");
    sendRequest(id, "playlist");
  }
});

var SongView = Backbone.View.extend({
  template: "#song_template",
  render: function(){
    this.$el.html(render(this.template, {data: songs}));
  },
  events: {
    "click .song_tr": "song_clicked"
  },
  song_clicked: function(event){
    id = $(event.currentTarget).attr("data-id");
    sendRequest(id, "song");
  }
});

// finally start the app (call all the initializers)
PlayMusicControllerApp.start();

/*** util functions ***/
function render(template, data){
  return Mustache.render($(template).html(), data);
}