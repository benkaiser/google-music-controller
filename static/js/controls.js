// Setup messenger
Messenger.options = {
    extraClasses: 'messenger-fixed messenger-on-bottom messenger-on-right',
    theme: 'air'
}
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
  songs = data.songs;
  songView = new SongView();
  PlayMusicControllerApp.song_region.show(songView);
});

$(document).ready(function(){
  $("#user-display").html(user);

  $("#play").click(function(){
    sendRequest("play", "state", "Toggling Play State");
  });
  $("#next").click(function(){
    sendRequest("next", "state", "Playing to next song.");
  });
  $("#prev").click(function(){
    sendRequest("prev", "state", "Playing previous song.");
  });
  $(".fixed_refresh").click(function(){
    socket.emit('init_controls', { user: user});
  });
});

function sendRequest(control, type, human_readable){
  human_readable = human_readable || "Sending control.";
  socket.emit("control", {control: type, value: control, user: user});
  Messenger().post({
    message: human_readable,
    type: 'success'
  });
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
    sendRequest(id, "playlist", "Changing playlist.");
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
    idx = get_song_index(id);
    set_playing_song(idx);
    sendRequest(id, "song", "Playing song.");
    this.render();
  }
});

// data functions
function get_song_index(id){
  for (var i = songs.length - 1; i >= 0; i--) {
    if(songs[i].id == id){
      return i;
    }
  }
  return null;
}
function set_playing_song(idx){
  for (var i = songs.length - 1; i >= 0; i--) {
    songs[i].is_playing = false;
  };
  songs[idx].is_playing = true;
}

// finally start the app (call all the initializers)
PlayMusicControllerApp.start();

/*** util functions ***/
function render(template, data){
  return Mustache.render($(template).html(), data);
}