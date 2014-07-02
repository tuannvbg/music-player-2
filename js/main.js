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
  // audio: document.getElementsByTagName("audio")[0],
  audio: new Audio(),
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

    var that = this;

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
    // that.play();

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
    $('.menu li').on('click', function() {
      var track = this.getAttribute('data-track');
      if(track === that.currentTrack){
        that.play();
      }else{
        that.currentTrack = this.getAttribute('data-track');
        that.musicLoad();
      }
    });

    var ctrlDown = false;

    //Keyboard Mapping
    $(document).on('keydown', function(event) {

      //Input search
      var busca = $(".search-bar input");

      //Search input in focus?
      if (!busca.is(":focus")) {
        var esc = 27, space = 32, menu = 77, help = 72, search = 83, ctrl = 16, leftArrow = 37, rightArrow = 39, volDown = 40, volUp = 38;

        var key = event.keyCode;

        //console.log(key);

        if(key == ctrl){
          ctrlDown = true;
        }

        switch(key){
          //Play & Pause
          case space:
            that.play();
            break;
          case leftArrow:
            //Seek backward 5sec
            if (ctrlDown == false) {
              that.audio.currentTime -= 5;
              that.audio.play();
            }else{
              //Previous track
              that.prev();
            }
            break;
          case rightArrow:
            //Seek forward 5sec
            if (ctrlDown == false && (that.audio.currentTime + 5) < that.audio.duration) {
              that.audio.currentTime += 5;
              that.audio.play();
            }else{
              //Next track
              that.next();
            }
            break;
          //Volume Control
          case volUp:
            //Increase volume
            if (ctrlDown == true){
              that.vol("up");
            }
            break;
          case volDown:
            //Decrease volume
            if (ctrlDown == true){
              that.vol("down");
            }
            break;
          //Open & Close Menu
          case menu:
            $('body').toggleClass('menu-active').removeClass('search-active').removeClass('help-active');
            break;
          //Open & Close Search
          case search:
            $('body').toggleClass('search-active').removeClass('help-active').removeClass('menu-active');
            busca.focus().val();
            break;
          case help:
            $('body').toggleClass('help-active').removeClass('menu-active').removeClass('search-active');
            console.log("Help: in the next version! =)");
            break;
          case esc:
            $('body').removeClass();
            console.log("Escape");
            break;
        }
      }else{
        if (event.keyCode === 27) {
          busca.blur();
          $('body').removeClass('search-active');
        }
      }

    }).on('keyup', function(event) {
      if(event.keyCode == 16){
        ctrlDown = false;
        // console.log(ctrlDown);
      }
    });
    // Read lenght of music
    $(that.audio).bind('timeupdate',function(){
      if (this.ended){
        that.next();
      }else{
        that.setCurrentTime();
      }
    });
    // SHOW / HIDE - MENU, SEARCH, HELP
    $('header a').on('click', function() {
      var element = this.hash;
      element = element.replace('#','');

      switch(element){
        case 'playlist':
          $('body').toggleClass('menu-active');
          $('.menu-button').toggleClass('hidden-blur');
          break;
        case 'search':
          $('body').toggleClass('search-active');
          break;
        case 'info':
          $('body').toggleClass('help-active');
          break;
      }
      return false;
    });
    $('.help').on('click', function() {
      $('body').toggleClass('help-active');
    });
    $('.menu .close, .search-bar .close').on('click', function() {
      $('body').removeClass();
    });

    //Submit form
    $('.search-bar form').on('submit', function() {

      var valor = this.children[0].value;
      $.ajax({
        url: 'playlist.json',
        dataType: 'json',

        success : function(data){
          for (var i = 0, tamanho = data.length; i < tamanho; i++) {
            if(data[i].nm_music.toLowerCase().indexOf(valor) >= 0 || data[i].nm_artist.toLowerCase().indexOf(valor) >= 0){
              player.currentTrack = i;
              player.musicLoad();
              break;
            }
          };
        }
      });
      return false;
    });
  },
  play: function(){
    var play = $('.play');
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
    this.play();
  },
  prev: function(){
    if (player.audio.currentTime <= 3) {
      if( this.currentTrack === 0){
        this.currentTrack = this.totalTracks - 1;
      }else{
        this.currentTrack--;
      }
      this.musicLoad();
      this.play();
    }else{
      player.audio.currentTime = 0;
    }
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
    //Get possition in array
    var i = this.currentTrack;

    //Music Data
    var track = playlist[i];
    var music = track.nm_music;
    var artist = track.nm_artist;
    var album = track.nm_album;
    var cover = track.url_cover;

    // Set musicName, musicInfo
    this.musicName = music;
    this.musicInfo = artist+" - "+album;

    // Format url from Album covers and set CurrentCover URL
    var coverImage = "img/covers/"+cover;
    this.currentCover = coverImage;

    // Update track info
    $('.music-name').html(this.musicName); //Music name
    $('.music-info').html(artist+" - "+album); //Artist and album
    $('.cover img').attr("alt", music+" - "+artist+" - "+album); // Cover info
    $(".cover img").attr("src",coverImage).hide().fadeIn(1000); // Cover image
    $(".bgCover").attr("style","background-image: url("+coverImage+");").hide().show(); // Background

    // Active track on menu
    $('.menu li').removeClass('active');
    $('.menu li')[i].setAttribute('class','active');

    // Convert musicName to lowercase and add '-' into whitespaces and change src on audio player
    var url = music.replace(/ /g,"-").replace("'","").replace("(","").replace(")","").toLowerCase();
    console.log("Playing now: "+music+" by "+artist);
    this.audio.src = "sounds/"+url+"."+this.codecType['format'];
    this.audio.type = this.codecType['codec'];

    this.audio.load();
    this.setCurrentTime();
    this.setDuration();
    this.saveState();
    // this.play();
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
    document.getElementById("duration").innerHTML = this.formatTime(this.endTime);

  },
  setCurrentTime: function(){
    var progress = document.getElementById('progress');
    var trackBar = progress.parentNode.children[0];

    var current = Math.floor(this.audio.currentTime);
    var percent = ( current * 100 ) / player.endTime;

    progress.value = current;
    trackBar.style.width = percent+'%';
    document.getElementById("time").innerHTML = this.formatTime(this.audio.currentTime);



    this.audio.duration != this.endTime ? this.setDuration() : null ;

  },
  saveState: function(music){
    localStorage.setItem('music', this.currentTrack);
    if(music != null){
      player.currentTrack = music;
      player.musicLoad();
    }
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
    $('.scroll').jScrollPane();
  }
};

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

if (localStorage.getItem('music') > 0) {
  player.saveState(localStorage.getItem('music'));
}