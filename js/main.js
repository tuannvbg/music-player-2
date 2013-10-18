/*
  ### Music Player v0.5 ###
  Document    : main.js
  Author      : Rafaell Lycan
  Summary     :
      | Playlist
      | Player
*/
var playlist = []; // Playlist empty

var musicPlayer = {
  player: $('audio')[0],
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

    // Check the codec type
    if (that.player.canPlayType('audio/mpeg;')) {
      that.codecType["codec"] = 'audio/mpeg';
      that.codecType["format"] = "mp3";
    } else {
      that.codecType["codec"] = 'audio/ogg';
      that.codecType["format"] = "ogg";
    }

    // Set playlist size
    that.totalTracks = playlist.length;

    // Create a list with playlist
    that.makeList();

    // Load music and info
    that.musicLoad();
    that.updateTime();
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
      that.player.currentTime = this.value;
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

      var space = 32;
      var leftArrow = 37;
      var rightArrow = 39;
      var menu = 77;

      switch(event.keyCode){
        case space:
          that.play();
          break;
        case leftArrow:
          that.prev();
          break;
        case rightArrow:
          that.next();
          break;
        case menu:
          $('body').toggleClass('menu-active');
          $('.menu-button').toggleClass('hidden-blur');
          break;
      }

    })
    // Read lenght of music
    $(that.player).bind('timeupdate',function(){
      if (this.ended){
        that.next();
      }else{
        that.updateTime();
      }
    })
    // MENU & SEARCH: SHOW / HIDE
    $('.menu-button.btn-opacity , .close').on('click touchstart', function(){
      $('body').toggleClass('menu-active');
      $('.menu-button').toggleClass('hidden-blur');
    });
  },
  play: function(){
    play = $('.play');
    if(this.player.paused){
      play.removeClass('paused');
      this.playing = true;
      this.player.play();
    }else{
      play.addClass('paused');
      this.playing = false;
      this.player.pause();
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
  musicLoad: function(){
    var url;
    var cover;
    var i = this.currentTrack;

    // Set musicName, musicInfo
    this.musicName = playlist[i].nm_music;
    this.musicInfo = playlist[i].nm_artist+" - "+playlist[i].nm_album;

    // Format url from Album covers and set CurrentCover URL
    cover = "img/covers/"+playlist[i].url_cover;
    this.currentCover = cover;

    // Update track info
    $('.music-name').html(this.musicName); //Music name
    $('.music-info').html(this.musicInfo); //Artist and album
    $('.cover img').attr("alt", this.musicName+" - "+this.musicInfo); // Cover info
    $(".cover img").attr("src",this.currentCover).hide().fadeIn(1000); // Cover image
    $(".bgCover").attr("style","background-image: url("+this.currentCover+");").hide().show(); // Background

    // Convert musicName to lowercase and add '-' into whitespaces and change src on audio player
    url = playlist[i].nm_music.replace(/ /g,"-").replace("'","").toLowerCase();
    this.player.src = "sounds/"+url+"."+this.codecType['format'];
    this.player.type = this.codecType['codec'];

    this.player.load();
    this.play();
    this.updateTime();
  },
  updateTime: function(){

    var current = this.player.currentTime;
    var duration = this.player.duration;

    var c = Math.floor(this.player.currentTime).toString();
    var e = Math.floor(this.player.duration).toString();

    $('#progress').attr('max', e).attr('value', c);

    c = formatTime(c);
    e = formatTime(e);

    function formatTime(time) {
      var hr  = Math.floor(time / 3600);
      var min = Math.floor((time - (hr * 3600))/60);
      var sec = Math.floor(time - (hr * 3600) -  (min * 60));

      if (min < 10){
        min = "0" + min;
      }
      if (sec < 10){
        sec  = "0" + sec;
      }

      return min + ':' + sec;
    }

    $(".time-current").html(c);
    $(".time-end").html(e);

  },
  makeList: function(){
    var list = $('.menu ul');
    for (var i = 0; i < this.totalTracks; i++) {
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

// Add tracks on playlist
$.ajax({
  url: 'playlist.json',
  dataType: 'json',

  success : function(data){
    console.log("Sucesso!");
    playlist = data;
  },
  complete : function(){
    musicPlayer.init();
  }
});