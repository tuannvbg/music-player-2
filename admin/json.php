<?php

include('Banco.Class.php');

$banco = new Banco();

$json = $banco->toJson('music', null, "ORDER BY nm_music");

echo $json;