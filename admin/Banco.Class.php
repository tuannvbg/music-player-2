<?php

class Banco{

  private $host = "localhost";
  private $port = "5432";
  private $db = "rafaell";
  private $user = "rafaell";
  private $senha = "554488";

  private function conectar(){
    $con = pg_connect(
      "host=$this->host port=$this->port dbname=$this->db user=$this->user password=$this->senha"
      )or die("Problemas na conexao");
    // print_r($con);
    return $con;
  }

  public function listar($tabela, $onde = null, $outro = null){
    $con = $this->conectar();

    $sql = "SELECT * FROM ".$tabela;

    if($onde){
      $sql.= " WHERE ".$onde;
    }
    if($outro){
      $sql.= " ".$outro;
    }

    $result = pg_query($sql);

    return pg_fetch_all($result);

    pg_close($con);
  }

  public function toJson($tabela, $onde = null, $outro){
    $array = $this->listar($tabela, $onde, $outro);
    $json = array();
    foreach ($array as $dados) {
      $json[]= $dados;
    }
    return json_encode($json);
  }

  public function inserir($tabela , $dados){
    $con = $this->conectar();

    foreach( $dados as $campo => $valor ){ //Separa o post em campos e valores
      $campos[]  = $campo;//Monta um array somente com os campos
      $valor = str_replace("'", "''", $valor); //Formata apostrofo dentro do padrão SQL ANSI
      $valores[] = "'$valor'"; //Monta um array somente como os valores
    }

    $campos  = implode( ",", $campos );//Converte o array em string separando por virgula (Campos)
    $valores = implode( ",", $valores );//Converte o array em string separando por virgula (Valores)
    $sql = "insert into $tabela ( $campos ) values ( $valores )";
    return pg_query( $sql );//Insere o registro no banco
    // echo $sql;

    pg_close($con);
  }

}