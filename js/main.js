/*
  ### Music Player v0.1 ###
  Document    : main.js
  Author      : Rafaell Lycan
  Summary     :
      | Controls (Play, Pause)
      | JumpTo
      | window.ready and window.load
*/

// VARIABLES
var player = document.getElementById('player');
var tempo = document.getElementById('timer');
var progresso = document.getElementById('progresso');
var playlist = document.querySelectorAll('li');

//CONTROLS
function play(){
  player.play();
}
function pause(){
  player.pause();
}

//MORE FUNCTIONS
function jumpTo(){
  player.currentTime = tempo.value;
}

function getTime(){
  if(player.ended){
    next();
  }else{
    var atual = Math.floor(player.currentTime);
    var total = Math.floor(player.duration);
    var bar = document.getElementsByTagName('progress')[0];
    bar.setAttribute("max",total);
    bar.setAttribute("value",atual);
    progresso.innerHTML = timer(atual) + ' / ' + timer(total) ;
  }
}
function timer(time){
  m = parseInt((time / 60) % 60);
  s = parseInt(time % 60);
  if(s < 10){
    s = '0'+s;
  }
  return m + ':' + s;

  /*function updateTrackTime(track){
      var currTimeDiv = document.getElementById('currentTime');
      var durationDiv = document.getElementById('duration');

      var currTime = Math.floor(track.currentTime).toString();
      var duration = Math.floor(track.duration).toString();

      currTimeDiv.innerHTML = formatSecondsAsTime(currTime);

      if (isNaN(duration)){
        durationDiv.innerHTML = '00:00';
      }
      else{
        durationDiv.innerHTML = formatSecondsAsTime(duration);
      }
    }
    function formatSecondsAsTime(secs, format) {
      var hr  = Math.floor(secs / 3600);
      var min = Math.floor((secs - (hr * 3600))/60);
      var sec = Math.floor(secs - (hr * 3600) -  (min * 60));

      if (min < 10){
        min = "0" + min;
      }
      if (sec < 10){
        sec  = "0" + sec;
      }

      return min + ':' + sec;
    }*/
}
//KEY SHORTCUTS
function capturaTecla(event){
  if(event.keyCode == 13){
    jumpTo();
  }
}
window.onkeypress = function(key){
  key = key.keyCode;
  // if (key == 32) {  };
  // console.log(key);
  switch(key){
    case 32 : // Space
      player.paused?play():pause();
      break;
    default:
      console.log(key);
  }
}

function next(){
  player.src = "sounds/Shoot to thrill - ACDC.mp3";
  player.load();
  player.play();

/*var i=1;
var nextSong= "";
function setup() {
  document.getElementById('audio').addEventListener('ended', function(){
    i++
    nextSong = "Music/"+i+".mp3";
    audioPlayer.src = nextSong;
    audioPLayer.load();
    audioPlayer.play();
    if(i == 37) // this is the end of the songs.
    {
        i = 1;
    }
    }, false);
  }*/
}

function playlist(){
}
/*var audio;
var playlist;
var tracks;
var current;

init();
function init(){
    current = 0;
    audio = $('#audio');
    playlist = $('#playlist');
    tracks = playlist.find('li a');
    len = tracks.length - 1;
    audio[0].volume = .10;
    audio[0].play();
    playlist.find('a').click(function(e){
        e.preventDefault();
        link = $(this);
        current = link.parent().index();
        run(link, audio[0]);
    });
    audio[0].addEventListener('ended',function(e){
        current++;
        if(current == len){
            current = 0;
            link = playlist.find('a')[0];
        }else{
            link = playlist.find('a')[current];
        }
        run($(link),audio[0]);
    });
}
function run(link, player){
        player.src = link.attr('href');
        par = link.parent();
        par.addClass('active').siblings().removeClass('active');
        audio[0].load();
        audio[0].play();
} */
playlist.click = function(){
  conslog.log('log');
  return false;
}
