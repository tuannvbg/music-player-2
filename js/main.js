/*
  ### Music Player v0.5 ###
  Document    : main.js
  Author      : Rafaell Lycan
  Summary     :
      | Playlist
      | Player
      | Aside menu Toggle(show/hide)
*/

var playlist = [
  { trackname:"Radioactive", artist:"Imagine Dragons", album:"Continued Silence EP", cover: "imagine-dragons-ep-cover-300x300.jpg"},
  { trackname:"Too Close", artist:"Alex Clare", album:"The Lateness of the Hour", cover: "alex-clare-too-close.jpg"},
  { trackname:"Shoot to thrill", artist:"AC/DC", album:"Back in Black", cover: "backinblack_300.jpg"},
  { trackname:"Powerless", artist:"Linkin Park", album:"Living Things", cover: "Linkin-Park-Living-Things-300x300.jpg"},
  { trackname:"Main Title", artist:"Ramin Djawadi", album:"Music From The HBO Series", cover: "Game-of-Thrones-Official-Album-Cover-300x300.jpeg"},
  { trackname:"Go With The Flow", artist:"Queens of the Stone Age", album:"Songs for the Deaf", cover: "Queens_Of_The_Stone_Age-Songs_For_The_Deaf-Frontal-300x300.jpg"},
  { trackname:"Main Title Theme Song", artist:"Bear McCreary", album:"AMC's Original Soundtrack - Vol. 1", cover: "twd-s3-soundtrack-cover-325-300x300.jpg"},
  { trackname:"Derezzed", artist:"Daft Punk", album:"TRON: Legacy", cover: "trondp-300x300.gif"},
  { trackname:"He's a Pirate", artist:"Klaus Badelt", album:"Pirates Of The Caribbean", cover: "Pirates+Of+The+Caribbean+Original+Soundtrack+f168228348a077818cf31110L.jpg"},
  { trackname:"Opening Suite", artist:"Martin O'Donnell/Michael Salvatori", album:"Halo: Original Soundtrack", cover: "1372289716977s.jpg"}
];

var musicPlayer = {
  player: $('audio')[0],
  currentTrack: 0,
  musicName: "",
  musicInfo: "",
  currentCover: "",
  endTime: "",
  totalTracks: "",
  codecType: [],
  playing: false,
  init: function(){

    that = this;

    // Check the codec type
    if (this.player.canPlayType('audio/mpeg;')) {
      this.codecType["codec"] = 'audio/mpeg';
      this.codecType["format"] = "mp3";
    } else {
      this.codecType["codec"] = 'audio/ogg';
      this.codecType["format"] = "ogg";
    }

    // Read lenght of music
    $(this.player).bind('timeupdate',function(){
      if (that.player.ended){
        that.next();
      }else{
        that.updateTime();
      }
    })

    // Set playlist size
    this.totalTracks = playlist.length;

    // Create a list with playlist
    this.makeList();

    // Load music and info
    this.musicLoad();
    that.updateTime();
    this.play();

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
    $('#progress').change(function() {
      that.player.currentTime = this.value;
    });
    // List Mapping
    $('.menu li').on('click', function(event) {
      that.currentTrack = this.getAttribute('data-track');
      that.musicLoad();
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
          break;
      }

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
    this.musicName = playlist[i].trackname;
    this.musicInfo = playlist[i].artist+" - "+playlist[i].album;

    // Convert musicName to lowercase and add '-' into whitespaces and change src on audio player
    url = playlist[i].trackname.replace(/ /g,"-").replace("'","").toLowerCase();
    this.player.src = "sounds/"+url+"."+this.codecType['format'];
    this.player.type = this.codecType['codec'];

    // Format url from Album covers and set CurrentCover URL
    cover = "img/covers/"+playlist[i].cover;
    this.currentCover = cover;

    // Update track info
    $('.music-name').html(this.musicName); //Music name
    $('.music-info').html(this.musicInfo); //Artist and album
    $('.cover img').attr("alt", this.musicName+" - "+playlist[i].artist); // Cover info
    $(".cover img").attr("src",this.currentCover).hide().fadeIn(1000); // Cover image
    $(".bgCover").attr("style","background-image: url("+this.currentCover+");").hide().fadeIn(300); // Background

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
      var nome = playlist[i].trackname;
      var artist = playlist[i].artist;
      item.setAttribute("data-track",i);
      span.appendChild(document.createTextNode(artist));
      item.appendChild(document.createTextNode(nome));
      item.appendChild(span);
      list.append(item);
    }
  }
}

musicPlayer.init();

// MENU SHOW / HIDE
$('.menu-button.btn-opacity , .close').on('click touchstart', function(e){
  $('body').toggleClass('menu-active');
  $('.menu-button').toggleClass('hidden-blur').toggleClass('btn-opacity');
});


// myaudio.play(); // Play the music.
// myaudio.pause(); // Stop the music.
// myaudio.duration; // Returns the length of the music track.
// myaudio.currentTime = 0; // Rewind the audio to the beginning.
// myaudio.loop = true; // Make the audio track loop.
// myaudio.muted = true; // Mute the track
// duration = song.duration;