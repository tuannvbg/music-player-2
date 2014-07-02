<!doctype html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <title>Titulo</title>
  <link rel="stylesheet" href="http://getbootstrap.com/2.3.2/assets/css/bootstrap.css">
  <style type="text/css">
    .column{
      width: 50%;
      float: left;
    }
    label{
      text-transform: uppercase;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="row">
      <div class="span12">
        <br>
        <?php
        if($_GET){
          echo $_GET["msg"] != ""? "<div class='alert alert-error'>".$_GET['msg']."</div>" : "<div class='alert alert-success'>Musica cadastrada com sucesso!</div>";
        }
        ?>

        <form action="upload.php" method="post" enctype="multipart/form-data">

          <fieldset>
            <legend>Cadastro de Musica</legend>
            <div class="column">
              <label for="music">Musica:*</label>
              <input type="text" name="music" id="music" required="required" placeholder="ex: Shoot to thrill">
              <br>

              <label for="artist">Artista:*</label>
              <input type="text" name="artist" id="artist" required="required" placeholder="ex: AC/DC">
              <br>

              <label for="album">Album:</label>
              <input type="text" name="album" id="album" placeholder="ex: Back in Black">
              <br>
            </div>

            <div class="column">
              <!-- MP3 -->
              <label for="mp3">Audio .MP3:*</label>
              <input type="file" name="mp3" id="mp3" accept="audio/mp3" required="required"><br>

              <!-- OGG -->
              <label for="mp3">Audio .OGG:</label>
              <input type="file" name="ogg" id="ogg" accept="audio/ogg"><br>

              <!-- IMAGE -->
              <label for="mp3">Image Capa:* <small>(300x300) (.png, .jpg, .gif)</small></label>
              <input type="file" name="img" id="img" accept="image/*" required="required"><br>
            </div>

            <input type="hidden" name="urlForm" value="<?php echo basename($_SERVER["REQUEST_URI"]); ?>">

            <div class="clearfix"></div>
            <hr>

            <input type="submit" value="Enviar" class="btn btn-primary">
          </fieldset>
        </form>
      </div>
    </div>
  </div>
</body>
</html>