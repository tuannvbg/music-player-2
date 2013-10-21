/*
  ### Music Player v0.5 ###
  Document    : main.js
  Author      : Rafaell Lycan
  Summary     :
      | Playlist
      | Player
*/
var playlist = []; // Playlist empty

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

    that.audio.addEventListener("loadedmetadata", this.updateTime(), false);
    that.audio.addEventListener("timeupdate", this.updateTime(), false);

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
    that.updateTime();

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

      var space = 32;
      var leftArrow = 37;
      var rightArrow = 39;
      var menu = 77;
      var busca = 66;

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
        case busca:
          $('.search-bar').toggle();
          break;
      }

    })
    // Read lenght of music
    $(that.audio).bind('timeupdate',function(){
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
    this.updateTime();
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
  updateTime: function(){

    $('#progress')
    .attr('max', Math.floor(this.audio.duration))
    .attr('value', Math.floor(this.audio.currentTime));

    $(".time-current").html(this.formatTime(that.audio.currentTime));
    $(".time-end").html(this.formatTime(that.audio.duration));

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
    playlist = data;
  },
  complete : function(){
    player.init();
  }
});