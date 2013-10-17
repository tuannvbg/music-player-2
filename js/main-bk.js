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
var folder = "sounds/";
var playlist = [
        "Radioactive - Imagine Dragons.mp3",
        "Alex Clare - Too Close.mp3",
        "Shoot to thrill - ACDC.mp3"
      ];
var currentSong = 0;

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
    var bar = document.getElementsByTagName('input')[0];
    bar.setAttribute("max",total);
    bar.setAttribute("value",atual);
    progresso.innerHTML = timer(atual) + ' / ' + timer(total) ;
  }
  /*audio[0].addEventListener('ended',function(e){
      current++;
      if(current < len){
        link = playlist.find('a')[current];
        run($(link),audio[0]);
      }
  });*/

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
  switch(key){
    case 32 : // Space
      player.paused?play():pause();
      break;
    default:
      console.log(key);
  }
}

function next(){
  var current = player.childNodes[1].getAttribute('src');
  var music = playlist[currentSong];

  if(currentSong < playlist.length -1){
    currentSong++;
  }else{
    currentSong = 0;
  }
  music = folder + playlist[currentSong];
  player.src = music;
  player.load();
  player.play();
}
function prev(){
  var current = player.childNodes[1].getAttribute('src');
  var music = playlist[currentSong];

  if(currentSong > 0){
    currentSong--;
  }else{
    currentSong = playlist.length -1;
  }
  music = folder + playlist[currentSong];
  player.src = music;
  player.load();
  player.play();
}

function loadPlaylist(){
  var list = document.getElementById('playlist');
  for (var i = 0; i < playlist.length; i++) {
    var item = document.createElement('li');
    item.appendChild(document.createTextNode(i+1+" - "+
      playlist[i].replace('.mp3','')
      )
    );
    list.appendChild(item);
  }
}
window.onload = loadPlaylist();