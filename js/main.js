/*
  ### Music Player v0.5 ###
  Document    : main.js
  Author      : Rafaell Lycan
  Summary     :
      | Playlist
      | Player
*/
var playlist = []; // Playlist empty
var searchlist = []; // searchlist empty

var player = {
  audio: document.getElementsByTagName("audio")[0],
  currentTrack: 0,
  musicName: "",
  musicInfo: "",
  currentCover: "",
  endTime: "",
  totalTracks: "",
  codecType: [],
  random: false,
  playing: false,
  init: function(){

    that = this;

    // Set playlist size
    that.totalTracks = playlist.length;

    // Create a list with playlist
    that.makeList();

    // Check the codec type
    if (that.audio.canPlayType('audio/mpeg;')) {
      that.codecType["codec"] = 'audio/mpeg';
      that.codecType["format"] = "mp3";
    } else {
      that.codecType["codec"] = 'audio/ogg';
      that.codecType["format"] = "ogg";
    }

    // Load music and info
    that.musicLoad();
    that.play();

    // Player Mapping
    $('.play').on('click', function() {
      that.play();
    });
    $('.next').on('click', function() {
      that.next();
    });
    $('.prev').on('click', function() {
      that.prev();
    });
    $('#progress').bind("change", function() {
      that.audio.currentTime = this.value;
    });
    // List Mapping
    $('.menu li').on('click', function(event) {
      var track = this.getAttribute('data-track');
      if(track === that.currentTrack){
        that.play();
      }else{
        that.currentTrack = this.getAttribute('data-track');
        that.musicLoad();
      }
    });

    //Keyboard Mapping
    $(document).on('keydown', function(event) {

      var busca = $(".search-bar input");

      if (!busca.is(":focus")) {
        var space = 32, leftArrow = 37, rightArrow = 39, menu = 77, volDown = 40, volUp = 38;

        var key = event.keyCode

        switch(key){
          case space:
            that.play();
            break;
          case leftArrow:
            that.prev();
            break;
          case rightArrow:
            that.next();
            break;
          case volUp:
            that.vol("up");
            break;
          case volDown:
            that.vol("down");
            break;
          case menu:
            $('body').toggleClass('menu-active');
            $('.menu-button').toggleClass('hidden-blur');
            break;
          default:
            if (key > 47 && key < 91) {
              $('body').addClass('search-active');
              busca.focus().val("");
            };
            break;
        }
      }else{
        if (event.keyCode === 27) {
          busca.blur();
          $('body').removeClass('search-active');
        }
      }

    })
    // Read lenght of music
    $(that.audio).bind('timeupdate',function(){
      if (this.ended){
        that.next();
      }else{
        that.setCurrentTime();
      }
    })
    // MENU & SEARCH: SHOW / HIDE
    $('.menu-button.btn-opacity , .menu > .close').on('click', function(){
      $('body').toggleClass('menu-active');
      $('.menu-button').toggleClass('hidden-blur');
    });
    $('.search-button.btn-opacity, .search-bar .close').on('click', function(){
      $('body').toggleClass('search-active');
      $('.search-button').toggleClass('hidden-blur');
    });
  },
  play: function(){
    play = $('.play');
    if(this.audio.paused){
      play.removeClass('paused');
      $('.menu li.active').removeClass('paused');
      this.playing = true;
      this.audio.play();
    }else{
      play.addClass('paused');
      $('.menu li.active').addClass('paused');
      this.playing = false;
      this.audio.pause();
    }
  },
  next: function(){
    if( (this.currentTrack + 1) === this.totalTracks){
      this.currentTrack = 0;
    }else{
      this.currentTrack++;
    }
    this.musicLoad();
  },
  prev: function(){
    if( this.currentTrack == 0){
      this.currentTrack = this.totalTracks - 1;
    }else{
      this.currentTrack--;
    }
    this.musicLoad();
  },
  vol: function(action){
    var volume = this.audio.volume;
    if (volume >= 0.10000000000000014 && action == "down"){
      this.audio.volume -= 0.1;
    }else if(volume < 1 && action == "up"){
      this.audio.volume += 0.1;
    }
  },
  musicLoad: function(){
    var i = this.currentTrack;

    // Set musicName, musicInfo
    this.musicName = playlist[i].nm_music;
    this.musicInfo = playlist[i].nm_artist+" - "+playlist[i].nm_album;

    // Format url from Album covers and set CurrentCover URL
    var cover = "img/covers/"+playlist[i].url_cover;
    this.currentCover = cover;

    // Update track info
    $('.music-name').html(this.musicName); //Music name
    $('.music-info').html(this.musicInfo); //Artist and album
    $('.cover img').attr("alt", this.musicName+" - "+this.musicInfo); // Cover info
    $(".cover img").attr("src",this.currentCover).hide().fadeIn(1000); // Cover image
    $(".bgCover").attr("style","background-image: url("+this.currentCover+");").hide().show(); // Background

    // Active track on menu
    $('.menu li').removeClass('active');
    $('.menu li')[i].setAttribute('class','active');

    // Convert musicName to lowercase and add '-' into whitespaces and change src on audio player
    url = playlist[i].nm_music.replace(/ /g,"-").replace("'","").toLowerCase();
    this.audio.src = "sounds/"+url+"."+this.codecType['format'];
    this.audio.type = this.codecType['codec'];

    this.audio.load();
    this.setCurrentTime();
    this.setDuration();
    this.play();
  },
  formatTime: function(time){
      var hr  = Math.floor(time / 3600);
      var min = Math.floor((time - (hr * 3600))/60);
      var sec = Math.floor(time - (hr * 3600) -  (min * 60));

      if (min < 10){
        min = "0" + min;
      }
      if (sec < 10){
        sec  = "0" + sec;
      }

      if (isNaN(min)) {
        min = "00";
      }

      if (isNaN(sec)) {
        sec = "00";
      }

      return min + ':' + sec;
  },
  setDuration: function(){
    var that = this;
    that.endTime = Math.floor(that.audio.duration);
    if (isNaN(Math.floor(that.audio.duration))) {
      setTimeout(function() {
        that.setDuration();
      }, 1);
    }else{
      var progress = document.getElementById('progress');
      progress.setAttribute('max', Math.floor(that.audio.duration));
    }
    document.getElementById("time-end").innerHTML = this.formatTime(this.endTime);

  },
  setCurrentTime: function(){
    var progress = document.getElementById('progress');
    progress.value = Math.floor(this.audio.currentTime);
    document.getElementById("time-current").innerHTML = this.formatTime(that.audio.currentTime);

    this.audio.duration != this.endTime? this.setDuration() : null ;

  },
  makeList: function(){
    var list = $('.menu ul');

    for (var i = 0; i < this.totalTracks; i++) {
      searchlist.push(playlist[i].nm_music);
      searchlist.push(playlist[i].nm_artist);
      var item = document.createElement('li');
      var span = document.createElement('span');
      var nome = playlist[i].nm_music;
      var artist = playlist[i].nm_artist;
      item.setAttribute("data-track",i);
      span.appendChild(document.createTextNode(artist));
      item.appendChild(document.createTextNode(nome));
      item.appendChild(span);
      list.append(item);
    }
  }
}

$('#music-search').typeahead({
  name: 'music',
  local: [ "Linkin Park", "Queens of the stone age", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune" ],
  // prefetch: 'playlist.json',
  limit: 10
});

// Add tracks on playlist
$.ajax({
  url: 'playlist.json',
  dataType: 'json',

  success : function(data){
    playlist = data;
  },
  complete : function(){
    player.init();
  }
});