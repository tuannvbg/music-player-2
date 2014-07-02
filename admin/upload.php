<?php

include('FileUpload.Class.php');

// header('Content-Type: text/html; charset=utf-8');

if ($_POST) {
  $music = $_POST['music'];
  $artist = $_POST['artist'];
  $album = $_POST['album'];
}

if ($_FILES) {
  $sounds = "../sounds/";z
  $cover = "../img/cover/";
  $error = false;

  $upload = new FileUpload();
  $file = $_FILES['mp3'];
  $tipo = explode("/", $file['type'])[1];

  if ($file['error'] > 0) {
    $error = "Selecione um arquivo de audio;";
  }else{

    if (!$upload->searchFile($sounds, $file)) {

      # Rename music
      $newName = $upload->convertString($music,$artist);
      $file['name'] = $newName.'.'.$tipo;

      # Upload music for server
      $upload->addFile($sounds, $file);

    }else{
      $error = "Já existe um arquivo com o mesmo nome";
    }
  }

  // echo "</pre>";
}

if ($error) {
  header("Location: index.php?msg=$error");
}else{
  header("Location: index.php?msg");
}