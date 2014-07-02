<?php

class FileUpload{

  #Add new $file
  public function addFile($folder, $file){
    return move_uploaded_file($file["tmp_name"], $folder . $file["name"]);
  }

  #Search $file into $folder
  public function searchFile($folder, $file){

    if (file_exists($folder . $file['name'])) {
      return true;
    }else{
      return false;
    }
  }

  #Convert string to clean and dashed format
  public function convertString($string, $string2 = null){
    $keys = array(' ','\'','/','\\');
    $placeholder = array('-','','-','-');
    $name = str_replace($keys, $placeholder, strtolower($string));
    if ($string2) {
      $name.= "-".str_replace($keys, $placeholder, strtolower($string2));
    }
    return $name;
  }
}